import { Container } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../components/Pagination/Pagination";
import FilterComponent from "../../components/RoleManagement/FilterComponent";
import User from "../../components/RoleManagement/User";
import SortIcon from "../../utils/icons/SortIcon";
import NoMatchingResultsFound from "../NotFound/NoMatchingResultsFound";
function RoleManagement() {
  const TABLE_HEAD = ["Name", "Role", "Email", "Actions"];
  const [users, setUsers] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [sortField, setSortField] = useState("defaultsort");
  const [direction, setDirection] = useState(true);
  const [lastClicked, setLastClicked] = useState(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [filterRole, setFilterRole] = useState("");
  let [newUrl, setNewUrl] = useState("");
  let [pageNo, setPageNo] = useState(1);
  let [pageSize, setPageSize] = useState(15);
  let [totalPages, setTotalPages] = useState("");
  let [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    axios.get(`/users`).then((data) => {
      setTotalUsers(data.data.content.length);
    });
  }, [totalUsers]);

  let handleClick = (fieldName) => {
    if (lastClicked === fieldName) {
      setDirection(!direction);
    }
    setLastClicked(fieldName);
  };

  const updateUser = (updatedUser) => {
    const updatedUsers = users.map((user) => {
      if (user.username === updatedUser.username) {
        return updatedUser;
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  useEffect(() => {
    const normalizedSortField = sortField || "defaultsort";
    newUrl = `/users?sortField=${normalizedSortField}&direction=${
      direction ? "ASC" : "DESC"
    }&firstName=${firstName}&lastName=${lastName}&email=${email}&pageNo=${
      parseInt(pageNo) - 1
    }&pageSize=${pageSize}&role=${filterRole}`;
    axios
      .get(newUrl)
      .then((elems) => {
        if (elems.data.content.length === 0 && pageNo > 1) {
          updatePageNumber(pageNo - 1);
        } else {
          setUsers(elems.data.content);
          setTotalPages(elems.data.totalPages);
        }
        setInitialized(true);
      })
      .catch(() => {
        setInitialized(true);
      });
  }, [
    sortField,
    direction,
    firstName,
    lastName,
    email,
    pageSize,
    pageNo,
    filterRole,
  ]);

  let getFilterInput = (params) => {
    setFirstName(params[0]);
    setLastName(params[1]);
    setEmail(params[2]);
    setFilterRole(params[3]);
  };

  const handleSelectChange = (event) => {
    const value = event.target.value;
    setPageSize(value);
  };

  const updatePageNumber = (pgNo) => {
    setPageNo(pgNo);
  };

  return (
    <Container maxWidth="xl">
      <FilterComponent filterInput={getFilterInput} />
      <div className="w-full mt-4">
        <div className="overflow-y-auto ">
          <table className="cater w-full text-left  border-b-2">
            <thead className="sticky top-0 z-30 text-white bg-gray-800">
              <tr>
                {TABLE_HEAD.slice(0, TABLE_HEAD.length).map((elem) => (
                  <th
                    key={elem}
                    className="table-th"
                    onClick={(e) => {
                      e.preventDefault();
                      const columnName = e.target.textContent;
                      if (columnName === "Name") {
                        setSortField("defaultsort");
                      } else if (columnName === "Email") {
                        setSortField("email");
                      }
                      handleClick(columnName.toLowerCase());
                      setDirection(!direction);
                    }}
                  >
                    {elem} {elem !== "Role" && <SortIcon />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-blue-marine">
              {users.map((user, index) => (
                <User
                  key={index}
                  {...user}
                  updateUser={updateUser}
                  classes={
                    index === users.length - 1
                      ? "px-4 py-2"
                      : "px-4 py-2 border-b-2"
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
        {!users.length && initialized && <NoMatchingResultsFound />}
        <Pagination
          pageNo={pageNo}
          pageSize={pageSize}
          totalPages={totalPages}
          updatePageNumber={updatePageNumber}
          handleSelectChange={handleSelectChange}
        />
      </div>
    </Container>
  );
}

export default RoleManagement;
