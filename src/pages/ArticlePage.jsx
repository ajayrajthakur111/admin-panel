// src/pages/ArticlePage.jsx
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

// Import Redux actions and thunks
import {
  fetchArticles,
  createArticle,
  updateArticle,
  deleteArticle,
  deleteMultipleArticles,
  openArticleModal,
  closeArticleModal,
  toggleSelectArticle,
  toggleSelectAllArticles,
} from "../features/article/articleSlice";
import { TrendingDown, TrendingUp } from "@mui/icons-material"; // Assuming these are used somewhere, though not in this component

// Styled Components
const PageHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ArticleTableContainer = styled(Paper)(() => ({
  borderRadius: "12px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eee",
  overflow: "hidden", // Ensure border radius applies to children
}));

const StyledTable = styled(Table)({
  minWidth: 650, // Adjust based on content width
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f4f6f8", // Light background for header
  "& .MuiTableCell-head": {
    fontWeight: "bold",
    color: "#333",
    borderBottom: "1px solid #ddd", // Header border
    padding: "12px 16px", // Adjust padding
  },
});

const StyledTableRow = styled(TableRow)(() => ({
  "&:last-child td, &:last-child th": { border: 0 },
  "&:hover": {
    backgroundColor: "#f9f9f9", // Subtle hover effect
  },
}));

const StyledTableCell = styled(TableCell)({
  borderBottom: "1px solid #eee", // Row border
  padding: "12px 16px", // Adjust padding
  // Apply specific width styles based on the screenshot layout
  "&.column-image": { width: "80px" },
  "&.column-title": { width: "200px" },
  "&.column-description": { flexGrow: 1 }, // Let description take remaining space
  "&.column-operations": { width: "150px" },
});

const ThumbnailImage = styled("img")({
  width: "50px", // Image size
  height: "50px",
  objectFit: "cover", // Cover to maintain aspect ratio
  borderRadius: "4px", // Slight border radius
});

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

const PaginationContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: "#fff", // White background for pagination area
  borderRadius: "12px",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
  border: "1px solid #eee",
}));

const PaginationButton = styled(IconButton)({
  padding: "8px", // Adjust padding for button size
  "&.Mui-disabled": {
    opacity: 0.5, // Less visible when disabled
  },
});

// Styled components for the Add/Edit Modal Form
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
  gap: "16px", // Space between form elements
  padding: "16px 0", // Add some vertical padding inside the dialog content
});

const ImageUploadArea = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "120px", // Adjust size as needed
  height: "120px",
  borderRadius: "50%", // Circular shape
  backgroundColor: "#f0f2f5", // Light grey background
  border: "2px dashed #ddd", // Dashed border
  cursor: "pointer",
  margin: "0 auto 24px auto", // Center and add space below
  position: "relative",
  overflow: "hidden", // Hide overflow for image preview

  "& input[type='file']": {
    display: "none", // Hide the actual file input
  },

  "& img": {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
}));

const UploadText = styled(Typography)({
  marginTop: "8px",
  fontSize: "0.9rem",
  color: "#555",
});

// Styled components for the Delete Confirmation Modal
const DeleteDialogTitle = styled(DialogTitle)({
  fontWeight: "bold",
  color: "#d32f2f", // Red color for danger
});

const DeleteDialogContent = styled(DialogContent)({
  paddingTop: "20px !important", // Important to override default padding
});

const DeleteButton = styled(Button)({
  backgroundColor: "#ef5350", // Red
  color: "#fff",
  "&:hover": { backgroundColor: "#e53935" }, // Darker red on hover
  textTransform: "none",
  borderRadius: "4px",
  boxShadow: "none",
});

const CancelButton = styled(Button)({
  color: "#757575", // Grey text
  borderColor: "#ddd", // Light border
  "&:hover": { borderColor: "#ccc", backgroundColor: "#f5f5f5" },
  textTransform: "none",
  borderRadius: "4px",
});

function ArticlePage() {
  const dispatch = useDispatch();
  // Get state from Redux slice
  const {
    articles,
    totalDocs,
    limit,
    page,
    totalPages,
    isLoading, // Overall loading for fetching list
    error, // Error for list fetching
    isModalOpen, // State for Add/Edit modal
    selectedArticle, // Article data for editing
    selectedArticleIds, // IDs of selected articles for deletion (via checkboxes)
  } = useSelector((state) => state.article);

  // Local state for the Add/Edit form fields in the modal
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImageFile, setFormImageFile] = useState(null);
  const [formImagePreview, setFormImagePreview] = useState(null);
  const [formError, setFormError] = useState(null); // Error specific to the Add/Edit form
  const [isFormSubmitting, setIsFormSubmitting] = useState(false); // Loading state for form submission

  // --- State for the Delete Confirmation Modal ---
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // This state will hold the ID(s) of the item(s) that are about to be deleted.
  // It's an array to handle both single and multiple deletions.
  const [itemsToDeleteIds, setItemsToDeleteIds] = useState([]);
  // --- End State for Delete Modal ---

  // Fetch articles on component mount and when page/limit changes
  useEffect(() => {
    dispatch(fetchArticles({ page, limit }));
  }, [dispatch, page, limit]);

  // Populate form fields when selectedArticle changes (for edit mode)
  useEffect(() => {
    if (selectedArticle) {
      setFormTitle(selectedArticle.title || "");
      setFormDescription(selectedArticle.description || "");
      setFormImagePreview(selectedArticle.image || null);
      setFormImageFile(null);
    } else {
      setFormTitle("");
      setFormDescription("");
      setFormImageFile(null);
      setFormImagePreview(null);
    }
    setFormError(null);
  }, [selectedArticle, isModalOpen]); // Clear form error on modal open/edit switch

  // Handle opening modal for Add New Article
  const handleAddArticleClick = () => {
    dispatch(openArticleModal(null)); // Open modal without passing article data
  };

  // Handle opening modal for Edit Article
  const handleEditArticleClick = (article) => {
    dispatch(openArticleModal(article)); // Open modal with article data
  };

  // Handle closing the Add/Edit modal
  const handleCloseModal = () => {
    dispatch(closeArticleModal());
  };

  // Handle file selection for image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormImageFile(null);
      setFormImagePreview(selectedArticle?.image || null);
    }
  };

  // Handle form submission (Add or Edit)
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setFormError(null);

    if (!formTitle || !formDescription) {
      setFormError("Title and Description are required.");
      return;
    }

    setIsFormSubmitting(true);

    const articleData = {
      title: formTitle,
      description: formDescription,
      image: formImageFile,
    };

    try {
      if (selectedArticle) {
        // Update existing article
        await dispatch(
          updateArticle({ id: selectedArticle._id, articleData })
        ).unwrap();
        setSuccessMessage("Article updated successfully!");
      } else {
        // Create new article
        await dispatch(createArticle(articleData)).unwrap();
        setSuccessMessage("Article created successfully!");
      }

      // Close modal and re-fetch articles
      handleCloseModal();
      dispatch(fetchArticles({ page, limit }));
    } catch (error) {
      setFormError(error || "An error occurred during submission.");
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // --- Handle Opening Delete Confirmation Modal ---

  // For a single article deletion
  const handleOpenSingleDeleteModal = (id) => {
    setItemsToDeleteIds([id]); // Set the ID in an array
    setIsDeleteModalOpen(true);
  };

  // For multiple selected articles deletion
  const handleOpenMultiDeleteModal = () => {
    if (selectedArticleIds.length === 0) {
      alert("Please select articles to delete."); // Or show a different kind of message
      return;
    }
    // itemsToDeleteIds is already updated via Redux state (selectedArticleIds)
    // No, we need to copy them or use the state directly
    setItemsToDeleteIds([...selectedArticleIds]); // Copy the selected IDs to local modal state
    setIsDeleteModalOpen(true);
  };
  // --- End Handle Opening Delete Confirmation Modal ---

  // --- Handle Closing Delete Confirmation Modal ---
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setItemsToDeleteIds([]); // Clear the IDs after closing
  };
  // --- End Handle Closing Delete Confirmation Modal ---

  // --- Handle Confirmation and Deletion ---
  const handleConfirmDeletion = async () => {
    setIsDeleteModalOpen(false); // Close the modal immediately

    if (itemsToDeleteIds.length === 0) {
      return; // Should not happen if buttons are disabled correctly
    }

    try {
      let successMessage = "";
      if (itemsToDeleteIds.length === 1) {
        await dispatch(deleteArticle(itemsToDeleteIds[0])).unwrap();
        successMessage = "Article deleted successfully!";
      } else {
        await dispatch(deleteMultipleArticles(itemsToDeleteIds)).unwrap();
        successMessage = "Selected articles deleted successfully!";
      }
      setSuccessMessage(successMessage);

      if (itemsToDeleteIds.length > 1) {
        dispatch(toggleSelectAllArticles(false)); // Deselect all via Redux
      }
      const remainingArticlesOnPage = articles.filter(
        (article) => !itemsToDeleteIds.includes(article._id)
      );
      if (remainingArticlesOnPage.length === 0 && page > 1) {
        dispatch(fetchArticles({ page: page - 1, limit })); // Go to previous page
      } else {
        dispatch(fetchArticles({ page, limit })); // Stay on current page, just refresh
      }
    } catch (error) {
      // Handle deletion errors (show general error message for the list)
      setFormError(error || "Failed to delete article(s).");
    } finally {
      setItemsToDeleteIds([]); // Clear modal's local state regardless of success/failure
    }
  };
  // --- End Handle Confirmation and Deletion ---

  // Handle pagination change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(fetchArticles({ page: newPage, limit }));
    }
  };

  // Handle select all checkbox in table header
  const handleSelectAllClick = (event) => {
    dispatch(toggleSelectAllArticles(event.target.checked));
  };

  // Check if all currently displayed articles are selected
  const isAllSelected =
    articles.length > 0 &&
    selectedArticleIds.length === articles.length &&
    articles.every((article) => selectedArticleIds.includes(article._id));

  // Placeholder for simple success message display
  const [successMessage, setSuccessMessage] = useState(null);
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Determine the message for the delete confirmation modal
  const getDeleteModalContentText = () => {
    if (itemsToDeleteIds.length === 1) {
      // Find the title of the single article being deleted if available
      const articleToDelete = articles.find(
        (art) => art._id === itemsToDeleteIds[0]
      );
      const articleTitle = articleToDelete
        ? `'${articleToDelete.title}'`
        : "this article";
      return `Are you sure you want to delete ${articleTitle}?`;
    } else if (itemsToDeleteIds.length > 1) {
      return `Are you sure you want to delete ${itemsToDeleteIds.length} selected articles?`;
    }
    return "Confirm deletion."; // Fallback message
  };

  return (
    <Box sx={{ p: 3 }}>
      {" "}
      {/* Page padding handled here */}
      <PageHeader>
        <Typography variant="h4" fontWeight="bold">
          Article
        </Typography>
        <Box>
          {/* Add New Article Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddArticleClick}
            disabled={isLoading || isFormSubmitting}
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              backgroundColor: "#198FA3",
            }}
          >
            Add new article
          </Button>
         
          <IconButton
            color="error"
            onClick={handleOpenMultiDeleteModal} // Open confirmation modal for selected items
            disabled={
              selectedArticleIds.length === 0 || isLoading || isFormSubmitting
            }
            sx={{ ml: 1 }} // Space from the button
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </PageHeader>
      {/* Display list-level error message */}
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
      {/* Show loading bar for initial fetch or pagination */}
      {isLoading && <LinearProgress sx={{ mb: 2 }} />}
      <ArticleTableContainer>
        <TableContainer>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell padding="checkbox">
                  {articles.length > 0 && ( // Only show checkbox if there are articles
                    <Checkbox
                      indeterminate={
                        selectedArticleIds.length > 0 &&
                        selectedArticleIds.length < articles.length
                      }
                      checked={isAllSelected}
                      onChange={handleSelectAllClick}
                      sx={{ color: "#198FA3" }} // Match theme color
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell className="column-image">
                  Image
                </StyledTableCell>
                <StyledTableCell className="column-title">
                  Title
                </StyledTableCell>
                <StyledTableCell className="column-description">
                  Description
                </StyledTableCell>
                <StyledTableCell align="center" className="column-operations">
                  Operations
                </StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {/* Render articles or a "No data" message */}
              {articles.length > 0 ? (
                articles.map((article) => {
                  const isItemSelected = selectedArticleIds.includes(
                    article._id
                  );
                  return (
                    <StyledTableRow key={article._id} selected={isItemSelected}>
                      <StyledTableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() =>
                            dispatch(toggleSelectArticle(article._id))
                          }
                          sx={{ color: "#198FA3" }} // Match theme color
                        />
                      </StyledTableCell>
                      <StyledTableCell className="column-image">
                        {article.image ? (
                          <ThumbnailImage
                            src={article.image}
                            alt={article.title || "Article Image"}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              backgroundColor: "#eee",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "4px",
                            }}
                          >
                            <Typography variant="caption">No Image</Typography>
                          </Box>
                        )}
                      </StyledTableCell>
                      <StyledTableCell className="column-title">
                        <Typography variant="body2" fontWeight="bold">
                          {article.title}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell className="column-description">
                        {/* Truncate description or handle long text */}
                        <Typography
                          variant="body2"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 3, // Limit to 3 lines
                            WebkitBoxOrient: "vertical",
                            whiteSpace: "normal",
                          }}
                        >
                          {article.description}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell
                        align="center"
                        className="column-operations"
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }} // Vertically center buttons
                      >
                        <OperationButton
                          variant="contained"
                          color="edit"
                          onClick={() => handleEditArticleClick(article)}
                        >
                          Edit
                        </OperationButton>
                        <OperationButton
                          variant="contained"
                          color="delete"
                          onClick={() =>
                            handleOpenSingleDeleteModal(article._id)
                          } // Open confirmation modal for single delete
                        >
                          Delete
                        </OperationButton>
                      </StyledTableCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={5} align="center">
                    <Typography>No articles found.</Typography>
                    {!isLoading && error && (
                      <Typography variant="body2" color="error">
                        Error loading data.
                      </Typography>
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </ArticleTableContainer>
      {/* Custom Pagination Controls */}
      {totalDocs > 0 && (
        <PaginationContainer>
          <Typography variant="body2" color="text.secondary">
            Showing {(page - 1) * limit + 1}-
            {page * limit > totalDocs ? totalDocs : page * limit} of {totalDocs}
          </Typography>
          <Box>
            <PaginationButton
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1 || isLoading} // Disable while loading
            >
              <ArrowBackIosIcon sx={{ fontSize: 16 }} />
            </PaginationButton>
            <PaginationButton
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages || isLoading} // Disable while loading
            >
              <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
            </PaginationButton>
          </Box>
        </PaginationContainer>
      )}
      {/* Add/Edit Article Modal (reused from previous version) */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <ModalTitle>
          {selectedArticle ? "Edit Article" : "Add New Article"}
          <IconButton aria-label="close" onClick={handleCloseModal}>
            <CloseIcon />
          </IconButton>
        </ModalTitle>
        <DialogContent dividers>
          <ModalForm component="form">
            <ImageUploadArea component="label">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formImagePreview ? (
                <img src={formImagePreview} alt="Image Preview" />
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
              id="article-title"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Enter Article title"
              size="small"
              sx={{
                ".MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f0f2f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#333" }}>
              Description*
            </InputLabel>
            <TextField
              required
              fullWidth
              id="article-description"
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Enter article description"
              multiline
              rows={4}
              size="small"
              sx={{
                ".MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  backgroundColor: "#f0f2f5",
                  "& fieldset": { border: "none" },
                },
              }}
            />
            {formError && (
              <Alert severity="error" sx={{ width: "100%" }}>
                {formError}
              </Alert>
            )}
          </ModalForm>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            disabled={isFormSubmitting}
            sx={{
              backgroundColor: "#4db6ac",
              "&:hover": { backgroundColor: "#26a69a" },
              color: "#fff",
              textTransform: "none",
              borderRadius: "8px",
              padding: "10px 24px",
            }}
          >
            {isFormSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
      >
        <DeleteDialogTitle>Confirm Deletion</DeleteDialogTitle>
        <DeleteDialogContent>
          <Typography variant="body1">
            {getDeleteModalContentText()} {/* Dynamic message */}
          </Typography>
         
        </DeleteDialogContent>
        <DialogActions>
          <CancelButton onClick={handleCloseDeleteModal} variant="outlined">
            Cancel
          </CancelButton>
          <DeleteButton
            onClick={handleConfirmDeletion}
            variant="contained"
            disabled={isLoading} 
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm"
            )}
          </DeleteButton>
        </DialogActions>
      </Dialog>
      {/* --- End Delete Confirmation Modal --- */}
    </Box>
  );
}

export default ArticlePage;
