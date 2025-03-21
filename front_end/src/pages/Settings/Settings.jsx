import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LinkUtils from "../../components/Settings/LinkUtils/LinkUtils";
import QaSection from "../../components/Settings/QA/QaSection";
import { showError, showSuccess } from "../../service/ToastService";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useFetchData } from "../../utils/hooks/useFetchData";

function Settings() {
  const { isAdmin, email } = useContext(UserLoginContext);

  const { data: user, loaded } = useFetchData(`/users/${email}/settings`);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  const [mailNotificationsEnabled, setMailNotificationsEnabled] =
    useState(false);
  const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);

  useEffect(() => {
    if (darkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkModeEnabled]);

  useEffect(() => {
      if (loaded && user) {
        setMailNotificationsEnabled(user?.mailNotificationsEnabled ?? false);
        setSubscribedToNewsletter(user?.subscribedToNewsletter ?? false);
        setDarkModeEnabled(user?.darkModeEnabled ?? true);
      }
    
  }, [loaded, user]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  let updateUserPreferences = () => {
    let userDto = {
      mailNotificationsEnabled: mailNotificationsEnabled,
      subscribedToNewsletter: subscribedToNewsletter,
      darkModeEnabled: darkModeEnabled,
    };
    axios
      .put(`/users/preferences/${email}`, userDto)
      .then((res) => {
        showSuccess("User preferences updated successfully");
        sessionStorage.setItem("darkModeEnabled", darkModeEnabled);
      })
      .catch((e) => {
        console.error(e);
        showError("Error updating user preferences");
      });
  };

  return (
    <div className="w-full m-2 ">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800 darkModeWhiteText">
        Settings
      </h1>
      <div className="m-2 flex flex-col gap-4">
        {isAdmin && (
          <div className="m-2 flex flex-col gap-4">
            <QaSection />
            <LinkUtils />
          </div>
        )}
        <div className="bg-white p-6 rounded-lg w-80 border border-gray-200 shadow-md reverseColors">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 reverseColors">
            User Options
          </h2>
          <FormGroup>
            <FormControlLabel
              className="reverseColors"
              control={
                <Checkbox
                  checked={mailNotificationsEnabled}
                  onChange={(e) =>
                    setMailNotificationsEnabled(e.target.checked)
                  }
                  color="primary"
                />
              }
              label={
                <span className="text-gray-700 reverseColors">
                  Allow email notifications
                </span>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={subscribedToNewsletter}
                  onChange={(e) => setSubscribedToNewsletter(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <span className="text-gray-700 reverseColors">
                  Subscribed to newsletter
                </span>
              }
            />
            <div>
              <label htmlFor="">Dark Mode:</label>
              <Switch
                className="ms-4"
                checked={darkModeEnabled}
                onChange={() => setDarkModeEnabled((prev) => !prev)}
              />
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="details-button"
                onClick={updateUserPreferences}
              >
                Save
              </button>
            </div>
          </FormGroup>
        </div>
      </div>
    </div>
  );
}

export default Settings;
