const RoleManagementIcon = ({ isSelected }) => {
  let fillColor = isSelected ? "white" : "black";
  return (
    <div className="roleManagementIcon">
      <svg
        className="svg-icon"
        width="24"
        height="24"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <a target="_blank" href="https://icons8.com/icon/2969/settings">
          Settings
        </a>{" "}
        icon by{" "}
        <a target="_blank" href="https://icons8.com">
          Icons8
        </a>
        <path
          fill={fillColor}
          d="M829.2 932.6l1.1-0.7c10.8-7.5 14.9-22.2 9.6-34.1-0.4-0.9-3.4-8.4-3.4-14.9 0-21.5 17.5-39 39-39h1.8c11 0 19.7-8.8 22.3-22.4 0-0.2 3.9-20.2 3.9-36.2 0-15.2-3.4-34.1-3.8-36.2-2.6-13.6-11.3-22.4-22.6-22.4h-1.6c-21.5 0-39-17.5-39-39 0-5.6 2.5-12.6 3.4-14.7 5.3-12 1.2-26.7-10.6-34.9L783.7 613c-3.6-1.5-7.4-2.3-11.5-2.3-8.3 0-16.4 3.4-21.8 9-5.7 5.9-20.7 17.9-31.1 17.9-10.5 0-25.6-12.3-31.3-18.2-5.4-5.7-13.7-9.2-22-9.2-4 0-7.8 0.8-11.2 2.2l-0.9 0.3-46.4 25.5-1.1 0.7c-10.8 7.5-14.9 22.2-9.6 34.1 0.4 0.9 3.5 8.4 3.5 14.9 0 21.5-17.5 39-39 39h-1.8c-11 0-19.7 8.8-22.3 22.5-0.4 2.1-3.8 20.9-3.8 36.2 0 15.2 3.5 34.1 3.8 36.2 2.6 13.6 11.3 22.4 22.6 22.4h1.5c21.5 0 39 17.5 39 39 0 5.6-2.5 12.6-3.4 14.7-5.3 12-1.2 26.6 10.5 34.9l44.7 24.9c3.6 1.5 7.4 2.3 11.5 2.3 8.4 0 16.6-3.5 22-9.4 5.5-6 21.1-19.1 31.8-19.1 10.8 0 26.3 13.1 32 19.5 5.4 6 13.7 9.5 22.2 9.5 4 0 7.8-0.8 12.4-2.8l45.2-25.1zM717.4 896c-13 0-26.9 5.3-41.2 15.8-4.7 3.5-9.1 7.2-13.3 11.3l-31.2-17.4c1.8-5.6 4-13.9 4-22.6 0-37.6-28-69-64.7-73.8-0.9-6.1-2.3-16-2.3-23.8 0-7.9 1.3-17.7 2.3-23.8 36.7-4.8 64.7-36.2 64.7-73.8 0-8.7-2.1-16.9-3.9-22.5l33.7-18.5c2.9 2.8 7.6 6.9 13.4 11 14.1 10.1 27.8 15.2 40.5 15.2 12.6 0 26.1-5 40.2-14.9 5.7-4 10.3-8 13.3-10.8l32.2 17.9c-1.8 5.6-4 13.9-4 22.6 0 37.6 28 69 64.7 73.8 1 6.2 2.3 16 2.3 23.8 0 7.8-1.3 17.6-2.3 23.8C828.9 814 801 845.4 801 883c0 8.7 2.1 16.9 3.9 22.5l-32.6 18c-2.9-2.9-7.6-7.2-13.4-11.5-14.4-10.6-28.4-16-41.5-16z"
        />
        <path
          fill={fillColor}
          d="M786.4 785.2c0-37.9-30.9-68.8-68.8-68.8s-68.8 30.9-68.8 68.8c0 38 30.9 68.8 68.8 68.8s68.8-30.9 68.8-68.8z m-68.8 33.4c-18.4 0-33.4-15-33.4-33.4s15-33.4 33.4-33.4 33.4 15 33.4 33.4c-0.1 18.4-15 33.4-33.4 33.4zM755.5 322.2c0-142.6-115.6-258.3-258.2-258.4v-0.1c-68.6 0-134.3 27.2-182.8 75.7-48.5 48.6-75.8 114.3-75.7 182.9 0 96.7 53.7 180 132.4 224.3-142.8 51.4-245.6 186.2-247 346.3v5.2c0.2 9.2 2 17.9 2.8 27.1h0.6c1.5 14.3 13.6 25.1 27.9 25.1 14.4 0 26.4-10.8 27.9-25.1h0.9c-0.8-9.7-2.9-19-2.9-28.8 0-83.8 33.2-164.1 92.4-223.4 59.2-59.2 139.6-92.5 223.4-92.5l28.7-2.9c128.9-14.3 229.6-122.5 229.6-255.4zM497.2 523.3c-111 0-201-90-201-201s90-201 201-201 201 90 201 201-89.9 201-201 201z"
        />
      </svg>
    </div>
  );
};

export default RoleManagementIcon;
