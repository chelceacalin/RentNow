import LinkUtils from "../../components/Settings/LinkUtils/LinkUtils";
import QaSection from "../../components/Settings/QA/QaSection";
function Settings() {
  return (
    <div className="w-full m-2">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Settings</h1>
      <div className="m-2 flex flex-col gap-4">
        <QaSection />
        <LinkUtils />
      </div>
    </div>
  );
}

export default Settings;
