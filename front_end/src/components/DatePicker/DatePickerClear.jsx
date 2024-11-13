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
              backgroundColor: "inherit", 
              '& .MuiInputBase-input': {
                color: "inherit", 
              },
              '& .MuiInputLabel-root': {
                color: "inherit",
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: "inherit",
                },
                '&:hover fieldset': {
                  borderColor: "inherit",
                },
                '&.Mui-focused fieldset': {
                  borderColor: "inherit",
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
                    color: "inherit",
                    backgroundColor: "transparent", 
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
