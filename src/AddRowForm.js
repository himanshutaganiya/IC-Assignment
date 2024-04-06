import { React, useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Button,
  Modal,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "10px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const AddRowForm = (props) => {
  const {
    openModal,
    setOpenModal,
    setRows,
    selectedRow,
    setSelectedRow,
    rows,
    searchedName,
    setSetSearchedRows,
  } = props;

  const [rowsData, setRowsData] = useState({
    name: "",
    gender: "",
    age: "",
    class: "",
  });
  let id = useRef(rows?.length);

  useEffect(() => {
    if (!!selectedRow)
      setRowsData({
        name: selectedRow?.name,
        gender: String(selectedRow?.gender),
        age: selectedRow?.age,
        class: Number(selectedRow?.class),
      });
  }, [selectedRow]);

  const [errorMsg, setErrorMsg] = useState("");
  const textFieldData = [
    {
      placeholder: "Enter Name",
      name: "name",
      value: rowsData.name,
      type: "text",
    },
    {
      placeholder: "Select Gender",
      name: "gender",
      value: rowsData.gender,
      type: "text",
    },
    {
      placeholder: "Enter Age",
      name: "age",
      value: rowsData.age,
      type: "text",
    },
    {
      placeholder: "Select Class",
      name: "class",
      value: rowsData.class,
      type: "text",
    },
  ];

  const handleCloseModal = () => {
    setOpenModal(false);
    setRowsData({
      name: "",
      gender: "",
      age: "",
      class: "",
    });
    setSelectedRow("");
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "age") {
      if (isNaN(value)) {
        return;
      }
    }
    setRowsData((rdata) => ({
      ...rdata,
      [name]: value,
    }));
  };
  const handleValidation = (e) => {
    let filedName = e.target.name;
    let fieldValue = e.target.value;

    if (filedName === "name" && fieldValue !== "") {
      if (fieldValue?.length > 32)
        setErrorMsg("Maximum 32 character are allowed");
      else
        for (let i = 0; i < fieldValue?.length; i++) {
          let ascii = fieldValue.charCodeAt(i);
          if (
            !(
              ascii === 32 ||
              (ascii >= 65 && ascii <= 90) ||
              (ascii >= 97 && ascii <= 122)
            )
          ) {
            setErrorMsg("Please enter only alphabets characters");
            break;
          } else setErrorMsg("");
        }
    } else if (
      filedName === "age" &&
      (fieldValue === "0" || fieldValue > 99 || fieldValue % 1 !== 0)
    ) {
      if (fieldValue % 1 !== 0) setErrorMsg(`Age can't be a floating number`);
      else
        setErrorMsg(
          `Age can't be ${fieldValue} please enter a number between 1-100`
        );
    } else setErrorMsg("");
  };
  const isAllFieldsFilled = () => {
    return textFieldData?.every((text) => text?.value !== "");
  };
  const handleAddRow = () => {
    id.current += 1;
    if (!!searchedName) {
      let searchedRows = [...rows, { ...rowsData, id: id.current }].filter(
        (row) => row.name.toLowerCase().includes(searchedName.toLowerCase())
      );
      console.log("searchedRows", searchedRows);
      setSetSearchedRows(searchedRows);
    }
    setRows((prevRows) => [...prevRows, { ...rowsData, id: id.current }]);
    setRowsData({
      name: "",
      gender: "",
      age: "",
      class: "",
    });
    handleCloseModal();
  };
  const handleEditRow = () => {
    const upadatedRow = rows.map((row) => {
      if (row.id === selectedRow?.id) {
        return rowsData;
      } else return row;
    });
    if (!!searchedName) {
      let searchedRows = upadatedRow.filter((row) =>
        row.name.toLowerCase().includes(searchedName.toLowerCase())
      );
      setSetSearchedRows(searchedRows);
    }
    handleCloseModal();
    setRowsData({
      name: "",
      gender: "",
      age: "",
      class: "",
    });
    setRows(upadatedRow);
  };
  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="parent-modal-title"
      aria-describedby="parent-modal-description"
    >
      <Box sx={{ ...style, width: "400px" }}>
        <Grid
          container
          justifyContent="center"
          style={{ alignItems: "center" }}
        >
          <Typography variant="h6">Add New Row</Typography>

          {textFieldData?.map((d) => {
            return (
              <Grid
                item
                style={{
                  width: "100%",
                  justifyItems: "center",
                  alignContent: "center",
                  margin: "5px",
                }}
                key={d.name}
              >
                <TextField
                  fullWidth
                  name={d?.name}
                  type={d?.type}
                  value={d?.value}
                  onChange={handleChange}
                  select={d?.name === "class" || d?.name === "gender"}
                  label={d?.placeholder}
                  maxLength={d?.name === "age" ? 2 : ""}
                  onKeyUp={(e) => handleValidation(e)}
                  error={document.activeElement?.name === d?.name && !!errorMsg}
                  helperText={
                    document.activeElement?.name === d?.name && errorMsg
                  }
                >
                  {d?.name === "class" &&
                    [1, 2, 3, 4, 5]?.map((c) => {
                      return (
                        <MenuItem value={c} key={c}>
                          {"class" + " " + c}
                        </MenuItem>
                      );
                    })}
                  {d?.name === "gender" &&
                    ["Male", "Female", "Other"]?.map((c) => {
                      return (
                        <MenuItem value={c} key={c}>
                          {c}
                        </MenuItem>
                      );
                    })}
                </TextField>
              </Grid>
            );
          })}
          <Button
            variant="contained"
            color="secondary"
            style={{
              textTransform: "none",
            }}
            onClick={handleCloseModal}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{
              textTransform: "none",
              marginLeft: "10px",
            }}
            onClick={!!selectedRow ? handleEditRow : handleAddRow}
            disabled={!isAllFieldsFilled()}
          >
            {!!selectedRow ? "Edit" : "Add"}
          </Button>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddRowForm;
