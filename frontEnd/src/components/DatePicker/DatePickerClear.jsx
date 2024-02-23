import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextField } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const DatePickerClear = (props) => {
  const { onClear, labelString } = props;
  const handleOnClear = () => {
    onClear();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        {...props}
        label={<span style={{ fontFamily: "Sanchez" }}>{labelString}</span>}
        slotProps={{ textField: { size: 'small' } }}
        format="YYYY-MM-DD"
        slots={{
          textField: (params) => (
            <div style={{ position: "relative", display: "inline-block" }}>
              <TextField {...params} />
              {params.value && (
                <FontAwesomeIcon
                  className="absolute top-4 cursor-pointer"
                  style={{
                    right: "40px",
                  }}
                  icon={faTimes}
                  size="xl"
                  onClick={handleOnClear}
                />
              )}
            </div>
          ),
        }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerClear;
