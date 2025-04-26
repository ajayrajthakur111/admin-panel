import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  InputLabel,
  LinearProgress,
} from "@mui/material";
import { styled } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import {
  fetchAutoDealerShips,
  createAutoDealerShip,
  deleteAutoDealerShip,
  openAutoDealerShipModal,
  closeAutoDealerShipModal,
  toggleSelectDealerShip,
  toggleSelectAllDealerShips,
} from "../features/autoDealership/autoDealershipSlice";

// --- Styled Components (SAME as ArticlePage) ---

const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
}));

const DealerTableContainer = styled(Paper)(() => ({
  borderRadius: "12px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eee",
  overflow: "hidden",
}));

const StyledTable = styled(Table)({ minWidth: 650 });

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f4f6f8",
  "& .MuiTableCell-head": {
    fontWeight: "bold",
    color: "#333",
    borderBottom: "1px solid #ddd",
    padding: "12px 16px",
  },
});

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": { border: 0 },
  "&:hover": { backgroundColor: "#f9f9f9" },
}));

const StyledTableCell = styled(TableCell)({
  borderBottom: "1px solid #eee",
  padding: "12px 16px",
  "&.column-image": { width: "80px" },
  "&.column-title": { width: "200px" },
  "&.column-description": { flexGrow: 1 },
  "&.column-operations": { width: "150px" },
});

const ThumbnailImage = styled("img")({
  width: "50px",
  height: "50px",
  objectFit: "cover",
  borderRadius: "4px",
});

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: "#fff",
  borderRadius: "12px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eee",
}));

const PaginationButton = styled(IconButton)({
  padding: "8px",
  "&.Mui-disabled": { opacity: 0.5 },
});

const ModalTitle = styled(DialogTitle)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "bold",
  color: "#333",
});

const ModalForm = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  padding: "16px 0",
});

const ImageUploadArea = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "120px",
  height: "120px",
  borderRadius: "50%",
  backgroundColor: "#f0f2f5",
  border: "2px dashed #ddd",
  cursor: "pointer",
  margin: "0 auto 24px auto",
  position: "relative",
  overflow: "hidden",
  "& input[type='file']": { display: "none" },
  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));
const OperationButton = styled(Button)(({ color }) => ({
  fontSize: "0.75rem", // Smaller text
  padding: "6px 12px", // Smaller padding
  minWidth: "auto", // Allow button to shrink
  marginRight: "4px", // Space between buttons
  textTransform: "none", // Keep text case
  borderRadius: "4px",
  boxShadow: "none",
  // Custom colors based on screenshot
  ...(color === "edit" && {
    backgroundColor: "#bbedd0", // Light Green for Edit background
    color: "#00ff80", // Bright Green for Edit text
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#638d64" }, // Darker hover for Edit
  }),
  ...(color === "delete" && {
    backgroundColor: "#ef5350", // Red for Delete background
    color: "#fff", // White for Delete text
    fontWeight: "bold",
    "&:hover": { backgroundColor: "#e53935" }, // Darker hover for Delete
  }),
}));
const UploadText = styled(Typography)({
  marginTop: "8px",
  fontSize: "0.9rem",
  color: "#555",
});

// --- End of Styled Components ---

function AutoDealerShipPage() {
  const dispatch = useDispatch();
  const {
    dealerships,
    totalDocs,
    limit,
    page,
    totalPages,
    isLoading,
    error,
    isModalOpen,
    selectedDealership,
    selectedDealershipIds,
  } = useSelector((state) => state.autoDealership);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchAutoDealerShips());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDealership) {
      setFormTitle(selectedDealership.name || "");
      setFormDescription(selectedDealership.description || "");
      setFormImagePreview(selectedDealership.image || null);
      setFormImageFile(null);
    } else {
      setFormTitle("");
      setFormDescription("");
      setFormImageFile(null);
      setFormImagePreview(null);
    }
    setFormError(null);
  }, [selectedDealership, isModalOpen]);

  const handleAddClick = () => dispatch(openAutoDealerShipModal(null));
  const handleEditClick = (dealer) => dispatch(openAutoDealerShipModal(dealer));
  const handleCloseModal = () => dispatch(closeAutoDealerShipModal());
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFormImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formTitle || !formDescription) {
      setFormError("Title and Description are required.");
      return;
    }
    setIsFormSubmitting(true);
    try {
      await dispatch(
        createAutoDealerShip({
          title: formTitle,
          description: formDescription,
          image: formImageFile,
        })
      ).unwrap();
      setSuccessMessage("Saved successfully!");
      handleCloseModal();
      dispatch(fetchAutoDealerShips());
    } catch (error) {
      setFormError(error || "An error occurred.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteAutoDealerShip(id)).unwrap();
      dispatch(fetchAutoDealerShips());
      setSuccessMessage("Deleted successfully!");
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  const handleBulkDelete = async () => {
    for (let id of selectedDealershipIds) {
      await dispatch(deleteAutoDealerShip(id));
    }
    dispatch(fetchAutoDealerShips());
    setSuccessMessage("Deleted selected successfully!");
    setIsDeleteModalOpen(false);
  };

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <PageHeader>
        <Typography variant="h4" fontWeight="bold">
          Auto DealerShip
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            disabled={isLoading}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#198FA3",
            }}
          >
            Add New
          </Button>
          <IconButton
            color="error"
            disabled={selectedDealershipIds.length === 0 || isLoading}
            onClick={() => setIsDeleteModalOpen(true)}
            sx={{ ml: 1 }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </PageHeader>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {/* Table */}
      <DealerTableContainer>
        <TableContainer>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  <Checkbox
                    checked={
                      dealerships.length > 0 &&
                      selectedDealershipIds.length === dealerships.length
                    }
                    indeterminate={
                      selectedDealershipIds.length > 0 &&
                      selectedDealershipIds.length < dealerships.length
                    }
                    onChange={(e) =>
                      dispatch(toggleSelectAllDealerShips(e.target.checked))
                    }
                  />
                </StyledTableCell>
                <StyledTableCell>Image</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell align="center">Operations</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {dealerships.map((dealer) => {
                const isSelected = selectedDealershipIds.includes(dealer._id);
                return (
                  <StyledTableRow key={dealer._id}>
                    <StyledTableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={() =>
                          dispatch(toggleSelectDealerShip(dealer._id))
                        }
                      />
                    </StyledTableCell>
                    <StyledTableCell>
                      {dealer.image ? (
                        <ThumbnailImage src={dealer.image} alt="dealer" />
                      ) : (
                        "No Image"
                      )}
                    </StyledTableCell>
                    <StyledTableCell>{dealer.name || "-"}</StyledTableCell>
                    <StyledTableCell>
                      {dealer.description || "-"}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <OperationButton
                        variant="contained"
                        color="edit"
                        onClick={() => handleEditClick(dealer)}
                      >
                        Edit
                      </OperationButton>{" "}
                      <OperationButton
                          variant="contained"
                          color="delete"
                          onClick={() =>
                            handleDelete(dealer._id)
                          } // Open confirmation modal for single delete
                        >
                          Delete
                        </OperationButton>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </DealerTableContainer>

      {/* Pagination */}
      <PaginationContainer>
        <Typography variant="body2" color="text.secondary">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, totalDocs)} of {totalDocs}
        </Typography>
        <Box>
          <PaginationButton
            disabled={page === 1}
            onClick={() => dispatch(fetchAutoDealerShips({ page: page - 1 }))}
          >
            <ArrowBackIosIcon fontSize="small" />
          </PaginationButton>
          <PaginationButton
            disabled={page === totalPages}
            onClick={() => dispatch(fetchAutoDealerShips({ page: page + 1 }))}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </PaginationButton>
        </Box>
      </PaginationContainer>

      {/* Add/Edit Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <ModalTitle>
          {selectedDealership ? "Edit DealerShip" : "Add DealerShip"}
          <IconButton aria-label="close" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </ModalTitle>
        <DialogContent dividers>
          <ModalForm>
            <ImageUploadArea component="label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formImagePreview ? (
                <img src={formImagePreview} alt="preview" />
              ) : (
                <>
                  <PhotoCameraIcon sx={{ fontSize: 40, color: "#555" }} />
                  <UploadText>Upload Image</UploadText>
                </>
              )}
            </ImageUploadArea>
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#333" }}>
              Title*
            </InputLabel>
            <TextField
              required
              fullWidth
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              size="small"
            />
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#333" }}>
              Description*
            </InputLabel>
            <TextField
              required
              fullWidth
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              size="small"
              multiline
              rows={4}
            />
            {formError && <Alert severity="error">{formError}</Alert>}
          </ModalForm>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={isFormSubmitting}
          >
            {isFormSubmitting ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <DialogTitle>Confirm Bulk Deletion</DialogTitle>
        <DialogContent dividers>
          <Typography>
            Are you sure you want to delete {selectedDealershipIds.length}{" "}
            selected dealership(s)?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleBulkDelete}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default AutoDealerShipPage;
