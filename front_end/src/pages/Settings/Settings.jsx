import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import LinkUtils from "../../components/Settings/LinkUtils/LinkUtils";
import QaSection from "../../components/Settings/QA/QaSection";
import { showError, showSuccess } from "../../service/ToastService";
import { UserLoginContext } from "../../utils/context/LoginProvider";
import { useFetchData } from "../../utils/hooks/useFetchData";

function Settings() {
  const { isAdmin, email } = useContext(UserLoginContext);

  const { data: user, loaded } = useFetchData(`/users/${email}`);

  const [mailNotificationsEnabled, setMailNotificationsEnabled] =
    useState(false);
  const [subscribedToNewsletter, setSubscribedToNewsletter] = useState(false);

  useEffect(() => {
    if (loaded) {
      setMailNotificationsEnabled(user.mailNotificationsEnabled);
      setSubscribedToNewsletter(user.subscribedToNewsletter);
    }
  }, [loaded, user]);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  let updateUserPreferences = () => {
    let userDto = {
      mailNotificationsEnabled: mailNotificationsEnabled,
      subscribedToNewsletter: subscribedToNewsletter,
    };
    axios
      .put(`/users/preferences/${email}`, userDto)
      .then((res) => {
        showSuccess("User preferences updated successfully");
      })
      .catch((e) => {
        console.error(e);
        showError("Error updating user preferences");
      });
  };

  return (
    <div className="w-full m-2">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Settings</h1>
      <div className="m-2 flex flex-col gap-4">
        {isAdmin && (
          <div className="m-2 flex flex-col gap-4">
            <QaSection />
            <LinkUtils />
          </div>
        )}
        <div className="bg-white p-6 rounded-lg w-80 border border-gray-200 shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            User Options
          </h2>
          <FormGroup>
            <FormControlLabel
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
                <span className="text-gray-700">Allow email notifications</span>
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
                <span className="text-gray-700">Subscribed to newsletter</span>
              }
            />
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
