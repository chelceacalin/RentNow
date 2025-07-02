package com.RentNow.apiGateway.filter;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpRequestDecorator;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.util.List;

@Component
@Slf4j
public class LoggingFilter implements GlobalFilter, Ordered {

    @Value("${custom.headersToHide:}")
    private List<String> headersToHide;

    @Value("${custom.hideDefaultHeaders:false}")
    private boolean hideDefaultHeaders;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();

        Object cachedBody = exchange.getAttribute("cachedRequestBodyObject");
        if ("GET".equalsIgnoreCase(request.getMethod().name()) ||
                request.getHeaders().getContentLength() <= 0 ||
                cachedBody != null) {
            logRequest(request, "");
            return chain.filter(exchange);
        }

        return DataBufferUtils.join(request.getBody())
                .flatMap(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);

                    String body = new String(bytes, StandardCharsets.UTF_8);
                    logRequest(request, body);

                    DataBuffer recreatedBuffer = exchange.getResponse().bufferFactory().wrap(bytes);
                    Flux<DataBuffer> recreatedBody = Flux.just(recreatedBuffer);

                    ServerHttpRequest decoratedRequest = new ServerHttpRequestDecorator(request) {
                        @Override
                        public Flux<DataBuffer> getBody() {
                            return recreatedBody;
                        }
                    };

                    exchange.getAttributes().put("cachedRequestBodyObject", recreatedBody);

                    return chain.filter(exchange.mutate().request(decoratedRequest).build());
                })
                .onErrorResume(ex -> {
                    log.warn("Error reading request body, proceeding without body logging", ex);
                    logRequest(request, "");
                    return chain.filter(exchange);
                });
    }

    private void logRequest(ServerHttpRequest request, String body) {
        String method = request.getMethod().name();
        StringBuilder curlRequest = new StringBuilder("curl");

        curlRequest.append(" -X ")
                .append(method)
                .append(" '")
                .append(request.getURI())
                .append("'");

        HttpHeaders filteredHeaders = getFilteredHeaders(request.getHeaders());

        filteredHeaders.forEach((key, values) -> {
            if (!values.isEmpty()) {
                String escapedValue = values.getFirst().replace("'", "'\"'\"'");
                curlRequest.append(" -H ")
                        .append("'")
                        .append(key)
                        .append(": ")
                        .append(escapedValue)
                        .append("'");
            }
        });

        if (!body.isEmpty()) {
            String escapedBody = body.replace("\\", "\\\\").replace("'", "'\"'\"'");
            curlRequest.append(" --data '").append(escapedBody).append("'");
        }

        log.info("Received call: {}", curlRequest.toString());
    }

    private HttpHeaders getFilteredHeaders(HttpHeaders requestHeaders) {
        if (hideDefaultHeaders) {
            HttpHeaders filteredHeaders = new HttpHeaders();
            requestHeaders.forEach((key, values) -> {
                if (headersToHide == null || !headersToHide.contains(key.toLowerCase())) {
                    filteredHeaders.put(key, List.copyOf(values));
                }
            });
            return filteredHeaders;
        }
        return requestHeaders;
    }

    @Override
    public int getOrder() {
        return -1;
    }
}