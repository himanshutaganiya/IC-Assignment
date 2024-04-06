import { React, useState, useMemo } from "react";
import AddRowForm from "./AddRowForm";
import {
  Grid,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Paper,
  TableBody,
  Tooltip,
  TextField,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";

const initialData = [
  { id: 1, name: "Jackson", gender: "Male", age: 5, class: "1" },
  { id: 2, name: "Janet", gender: "Female", age: 10, class: "2" },
  { id: 3, name: "Riya", gender: "Female", age: 12, class: "3" },
  { id: 4, name: "heena", gender: "Male", age: 5, class: "1" },
  { id: 5, name: "boot", gender: "Male", age: 10, class: "5" },
  { id: 6, name: "amar", gender: "Female", age: 12, class: "4" },
];

const tableHeading = [
  {
    id: 1,
    hName: "S.No",
  },
  {
    id: 2,
    hName: "Name",
  },
  {
    id: 3,
    hName: "Gender",
  },
  {
    id: 4,
    hName: "Age",
  },
  {
    id: 5,
    hName: "Class",
  },
  {
    id: 6,
    hName: "Edit Row",
  },
  {
    id: 7,
    hName: "Delete Row",
  },
];

const LandingPage = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [rows, setRows] = useState(initialData);
  const [selectedRow, setSelectedRow] = useState("");
  const [searchedName, setSearchedName] = useState("");
  const [searchedRows, setSetSearchedRows] = useState([]);
  const averageAge = useMemo(() => {
    console.log("calculateAverageAge function is getting called");
    return calculateAverageAge();
  }, [rows]);
  // const averageAge = calculateAverageAge();
  // console.log("averageAge", averageAge);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleDeleteRow = (row) => {
    const deleteRow = rows?.filter((r) => row?.id !== r?.id);
    if (!!searchedName) {
      let searchedRows = deleteRow.filter((row) =>
        row.name.toLowerCase().includes(searchedName.toLowerCase())
      );
      setSetSearchedRows(searchedRows);
    }
    setRows(deleteRow);
  };
  const handleEditRow = (row) => {
    // const deleteRow = rows?.filter((r) => row?.id !== r?.id);
    // setRows(deleteRow);
    setSelectedRow(row);
    setOpenModal(true);
  };
  const handleSortTable = (id) => {
    let sortedData = rows.sort((a, b) =>
      id === 4
        ? a?.age - b?.age
        : id === 5
        ? a?.class - b?.class
        : id === 2 && a.name.toLowerCase() < b.name.toLowerCase()
        ? -1
        : 1
    );
    setRows([...sortedData]);
  };

  function calculateAverageAge() {
    let totalAgeSum = 0;
    let currentRows = !!searchedName ? searchedRows : rows;
    if (currentRows.length === 0) return 0;
    for (let i = 0; i < currentRows?.length; i++) {
      totalAgeSum += Number(currentRows[i]?.age);
    }
    return Math.floor(totalAgeSum / currentRows?.length);
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchedName(value);
    let searchedRows = [...rows].filter((row) =>
      row.name.toLowerCase().includes(value.toLowerCase())
    );
    setSetSearchedRows(searchedRows);
  };
  let rowsToDisplay = !!searchedName ? searchedRows : rows;

  return (
    <Grid container style={{ alignItems: "center" }}>
      <Grid
        item
        style={{
          alignItems: "center",
          justifyItems: "flex-start",
          display: "flex",
          width: "100%",
          height: "50px",
          margin: "4px",
          marginLeft: "5%",
        }}
      >
        <Button
          onClick={handleOpenModal}
          variant="contained"
          color="success"
          style={{
            textTransform: "none",
          }}
        >
          Add Rows
        </Button>
      </Grid>
      <Grid
        item
        style={{
          alignItems: "center",
          justifyItems: "flex-start",
          display: "flex",
          width: "100%",
          margin: "4px",
          marginLeft: "5%",
        }}
      >
        <TextField
          name="names"
          type="text"
          value={searchedName}
          onChange={handleChange}
          label="Search Name"
        ></TextField>
      </Grid>

      <TableContainer
        component={Paper}
        style={{ width: "100%", marginRight: "5%", marginLeft: "5%" }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {tableHeading?.map((thead) => {
                return (
                  <TableCell
                    key={thead.id}
                    style={{
                      color: "black",
                      fontWeight: "bolder",
                    }}
                  >
                    <Grid container>
                      <Grid item>{thead.hName}</Grid>
                      <Grid item>
                        {(thead?.id === 2 ||
                          thead?.id === 4 ||
                          thead?.id === 5) && (
                          <Tooltip title="sort" arrow>
                            <SortIcon
                              style={{ cursor: "pointer" }}
                              onClick={() => handleSortTable(thead?.id)}
                            />
                          </Tooltip>
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay?.map((row, index) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.gender}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>Class {`${row.class}`}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={() => handleEditRow(row, index)}
                  >
                    Edit
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="error"
                    style={{
                      textTransform: "none",
                    }}
                    onClick={() => handleDeleteRow(row, index)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3}>SUMMARY</TableCell>
              <TableCell>Average Age :{averageAge}</TableCell>
            </TableRow>
          </TableBody>
          <AddRowForm
            openModal={openModal}
            setOpenModal={setOpenModal}
            setRows={setRows}
            rows={rows}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            searchedName={searchedName}
            setSetSearchedRows={setSetSearchedRows}
          />
        </Table>
      </TableContainer>
    </Grid>
  );
};

export default LandingPage;
