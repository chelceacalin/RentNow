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
        label={labelString}
        slotProps={{
          textField: {
            size: 'small',
            sx: {
              // Use default styles, or adjust if necessary
              backgroundColor: "inherit", // Inherit or use default background
              '& .MuiInputBase-input': {
                color: "inherit", // Default text color
              },
              '& .MuiInputLabel-root': {
                color: "inherit", // Default label color
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: "inherit", // Default border color
                },
                '&:hover fieldset': {
                  borderColor: "inherit", // Default hover border color
                },
                '&.Mui-focused fieldset': {
                  borderColor: "inherit", // Default focused border color
                },
              },
            },
          },
        }}
        slots={{
          textField: (params) => (
            <div style={{ position: "relative", display: "inline-block" }}>
              <TextField {...params} />
              {params.value && (
                <FontAwesomeIcon
                  className="absolute top-4 right-4 cursor-pointer"
                  style={{
                    color: "inherit", // Default icon color
                    backgroundColor: "transparent", // Ensure background is transparent
                  }}
                  icon={faTimes}
                  size="small"
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
