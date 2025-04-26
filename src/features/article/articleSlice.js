// src/features/article/articleSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import getCookie from '../../util/getCookie'; // Assuming getCookie utility is available

// Define your backend API base URL using environment variable
const baseUrl = import.meta.env.VITE_API_BASE_URL; // Ensure VITE_API_BASE_URL is set

// Async Thunk for fetching articles
export const fetchArticles = createAsyncThunk(
  'article/fetchArticles',
  async (params = {}, { rejectWithValue }) => {
    try {
      const token = getCookie('adminToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search: params.search || '',
          fromDate: params.fromDate || '',
          toDate: params.toDate || '',
          page: params.page || 1,
          limit: params.limit || 10, // Default limit to 10 or adjust as needed
        },
      };

      const response = await axios.get(baseUrl + 'Article/getArticle', config);

      if (response.data?.status === 200 && response.data?.data) {
        // API returns data in the format { docs: [...], totalDocs: ..., page: ..., ... }
        return response.data.data;
      } else {
        return rejectWithValue(response.data?.message || 'Unexpected response structure for articles');
      }

    } catch (error) {
      console.error("Error fetching articles:", error);
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch articles');
      }
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  }
);

// Async Thunk for creating an article
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (articleData, { rejectWithValue }) => {
    try {
      const token = getCookie('adminToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: {
           Authorization: `Bearer ${token}`,
           // 'Content-Type': 'multipart/form-data', // Axios sets this automatically with FormData
        },
      };

      // The API expects FormData for image upload
      const formData = new FormData();
      formData.append('title', articleData.title);
      formData.append('description', articleData.description);
      if (articleData.image) { // Only append image if a file is selected
          formData.append('image', articleData.image);
      }


      const response = await axios.post(baseUrl + 'Article/createArticle', formData, config);

      if (response.data?.status === 200) {
        return response.data; // Or return the created article data if needed
      } else {
        return rejectWithValue(response.data?.message || 'Failed to create article');
      }

    } catch (error) {
      console.error("Error creating article:", error);
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to create article');
      }
      return rejectWithValue(error.message || 'Failed to create article');
    }
  }
);

// Async Thunk for updating an article
export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async ({ id, articleData }, { rejectWithValue }) => { // articleData might include title, description, and potentially new image
    try {
      const token = getCookie('adminToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: {
           Authorization: `Bearer ${token}`,
            // The API spec in Postman shows PUT takes JSON body without image.
            // If the backend CAN handle FormData with image for PUT, use 'multipart/form-data'.
            // If not, you might need a separate API for image updates or only allow text updates.
            // Assuming PUT can take JSON for text fields:
           'Content-Type': 'application/json', // Default for JSON body
        },
      };

       // API spec shows PUT takes JSON for title/description, no image field.
       // Send only title and description in the JSON body.
       const response = await axios.put(baseUrl + `Article/updateArticle/${id}`, {
           title: articleData.title,
           description: articleData.description,
           // Image update might need a separate endpoint or different request type
           // Based on POSTMAN, PUT is only for text fields
       }, config);

      if (response.data?.status === 200) {
        return response.data; // Or return updated article data
      } else {
        return rejectWithValue(response.data?.message || 'Failed to update article');
      }

    } catch (error) {
      console.error("Error updating article:", error);
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to update article');
      }
      return rejectWithValue(error.message || 'Failed to update article');
    }
  }
);


// Async Thunk for deleting an article
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id, { rejectWithValue }) => {
    try {
      const token = getCookie('adminToken');
      if (!token) {
        return rejectWithValue('No authentication token found.');
      }
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.delete(baseUrl + `Article/deleteArticle/${id}`, config);

      if (response.status === 200) {
        console.log(response)
        return id; // Return the ID of the deleted item to update state
      } else {
        return rejectWithValue(response.data?.message || 'Failed to delete article');
      }

    } catch (error) {
      console.error("Error deleting article:", error);
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || 'Failed to delete article');
      }
      return rejectWithValue(error.message || 'Failed to delete article');
    }
  }
);

// NOTE: No API endpoint for batch delete was provided in the Postman collection.
// This thunk is implemented for frontend logic, but you might need to
// create a backend endpoint for it, or iterate and call deleteArticle multiple times
// (less efficient). For now, it's a placeholder assuming a batch delete API.
export const deleteMultipleArticles = createAsyncThunk(
    'article/deleteMultipleArticles',
    async (ids, { rejectWithValue }) => {
        try {
             // --- PLACEHOLDER: Replace with actual batch delete API call ---
             // Example if API was DELETE /api/v1/admin/Article/deleteBulk with { ids: [...] }
             // const token = getCookie('adminToken');
             // if (!token) {
             //     return rejectWithValue('No authentication token found.');
             // }
             // const config = {
             //     headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
             //      // For DELETE with body, 'data' property is used with Axios
             //     data: { ids: ids }
             // };
             // const response = await axios.delete(baseUrl + 'Article/deleteBulk', config);
             // if (response.data?.status === 200) {
             //    return ids; // Return the list of deleted IDs
             // } else {
             //    return rejectWithValue(response.data?.message || 'Failed to delete multiple articles');
             // }
             // --- END PLACEHOLDER ---


             // --- Fallback: Iterate and delete individually (Less efficient) ---
             const results = await Promise.all(ids.map(id =>
                 axios.delete(baseUrl + `Article/deleteArticle/${id}`, { headers: { Authorization: `Bearer ${getCookie('adminToken')}` } })
                 .then(() => id) // Return the ID if successful
                 .catch(err => {
                     console.error(`Failed to delete article ${id}:`, err);
                     return null; // Return null or error object for failed deletions
                 })
             ));

             // Filter out failed deletions and return successful ones
             const successfulDeletions = results.filter(id => id !== null);

             if (successfulDeletions.length > 0) {
                 if (successfulDeletions.length < ids.length) {
                     // Partial success
                      console.warn(`Partially deleted articles. Failed to delete: ${ids.filter(id => !successfulDeletions.includes(id)).join(', ')}`);
                 }
                 return successfulDeletions; // Return list of successfully deleted IDs
             } else {
                 return rejectWithValue('Failed to delete any selected articles.');
             }
             // --- END Fallback ---


        } catch (error) {
            console.error("Error deleting multiple articles:", error);
            if (error.response?.data) {
                return rejectWithValue(error.response.data.message || 'Failed to delete multiple articles');
            }
            return rejectWithValue(error.message || 'Failed to delete multiple articles');
        }
    }
);


// Initial state
const initialState = {
  articles: [],
  totalDocs: 0,
  limit: 10, // Matches default limit in fetchArticles
  page: 1,
  totalPages: 1,
  isLoading: false,
  error: null,
  isModalOpen: false, // State for the add/edit modal
  selectedArticle: null, // Null for add, article object for edit
  selectedArticleIds: [], // Array of IDs for multi-select deletion
};

// Article slice
const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // Reducer to open the add/edit modal, optionally with data for editing
    openArticleModal: (state, action) => {
      state.isModalOpen = true;
      state.selectedArticle = action.payload || null; // Pass article object for edit
    },
    // Reducer to close the modal and clear selected article for edit
    closeArticleModal: (state) => {
      state.isModalOpen = false;
      state.selectedArticle = null;
    },
     // Reducer to toggle selection for multi-delete
    toggleSelectArticle: (state, action) => {
       const id = action.payload;
       if (state.selectedArticleIds.includes(id)) {
          state.selectedArticleIds = state.selectedArticleIds.filter(articleId => articleId !== id);
       } else {
          state.selectedArticleIds.push(id);
       }
    },
    // Reducer to toggle select all
    toggleSelectAllArticles: (state, action) => {
        const isChecked = action.payload; // true if select all is checked
        if (isChecked) {
             // Select all currently displayed article IDs
            state.selectedArticleIds = state.articles.map(article => article._id);
        } else {
            state.selectedArticleIds = []; // Deselect all
        }
    },
     // Reducer to clear all selected articles (e.g., after deletion)
    clearSelectedArticles: (state) => {
        state.selectedArticleIds = [];
    }
  },
  extraReducers: (builder) => {
    // Reducers for fetchArticles
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update state with pagination data from the API response
        state.articles = action.payload.docs;
        state.totalDocs = action.payload.totalDocs;
        state.limit = action.payload.limit;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.error = null;
        // Clear selected items when fetching a new page or applying filters
        state.selectedArticleIds = [];
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.articles = []; // Clear articles on error
        state.totalDocs = 0;
        state.totalPages = 0;
        state.page = 1;
        state.error = action.payload;
        state.selectedArticleIds = [];
      });

    // Reducers for createArticle
    builder
       .addCase(createArticle.pending, () => {
           // Maybe add a specific loading state for modal actions if needed
       })
       .addCase(createArticle.fulfilled, (state, ) => {
           // Optionally add the new article to the state if API returns it
           // state.articles.unshift(action.payload.data); // If API returns new article
           // Or re-fetch articles to get the latest list including the new one
           // This will be handled by the component dispatching fetchArticles after modal closes
           state.isModalOpen = false; // Close modal on success
           state.selectedArticle = null; // Clear selected article
       })
       .addCase(createArticle.rejected, (state, action) => {
           // Handle error (maybe show a message in the modal)
           console.error("Create article failed:", action.payload);
           // Don't close modal on failure, let the component handle error display
       });

    // Reducers for updateArticle
     builder
       .addCase(updateArticle.pending, () => {
            // Specific loading state for update
       })
       .addCase(updateArticle.fulfilled, (state) => {
           // Optionally update the specific article in the state
           // const updatedArticle = action.payload.data; // Assuming API returns updated article
           // const index = state.articles.findIndex(article => article._id === updatedArticle._id);
           // if (index !== -1) {
           //    state.articles[index] = updatedArticle;
           // }
           // Or re-fetch articles to get the latest list
            state.isModalOpen = false; // Close modal on success
            state.selectedArticle = null; // Clear selected article
       })
       .addCase(updateArticle.rejected, (state, action) => {
           console.error("Update article failed:", action.payload);
       });

    // Reducers for deleteArticle
    builder
      .addCase(deleteArticle.pending, () => {
           // Maybe set a deleting state for the specific item
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        if (action.payload) {
            state.articles = state.articles.filter(article => article._id !== action.payload.id);
            state.selectedArticleIds = state.selectedArticleIds.filter(id => id !== action.payload.id);
            state.totalDocs = Math.max(0, state.totalDocs - 1); // Update total count
        }
    })
    
      .addCase(deleteArticle.rejected, (state, action) => {
           console.error("Delete article failed:", action.payload);
      });

    // Reducers for deleteMultipleArticles
    builder
      .addCase(deleteMultipleArticles.pending, () => {
          // Specific loading state for bulk delete
      })
      .addCase(deleteMultipleArticles.fulfilled, (state, action) => {
          const deletedIds = action.payload; // Array of successfully deleted IDs
          state.articles = state.articles.filter(article => !deletedIds.includes(article._id));
          state.selectedArticleIds = state.selectedArticleIds.filter(id => !deletedIds.includes(id)); // Remove from selected
          // state.totalDocs -= deletedIds.length; // Adjust totalDocs
          // Consider re-fetching the current page if all items on it were deleted
      })
      .addCase(deleteMultipleArticles.rejected, (state, action) => {
          console.error("Bulk delete failed:", action.payload);
          // Keep selected items on failure, let user retry or see error
      });
  },
});

export const {
  openArticleModal,
  closeArticleModal,
  toggleSelectArticle,
  toggleSelectAllArticles,
  clearSelectedArticles
} = articleSlice.actions;
export default articleSlice.reducer;