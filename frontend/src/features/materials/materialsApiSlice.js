import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const materialsAdapter = createEntityAdapter({
    sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = materialsAdapter.getInitialState()

export const materialsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMaterials: builder.query({
            query: () => ({
                url: '/materials',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                const loadedMaterials = responseData.map(material => {
                    material.id = material._id
                    return material
                });
                return materialsAdapter.setAll(initialState, loadedMaterials)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Material', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Material', id }))
                    ]
                } else return [{ type: 'Material', id: 'LIST' }]
            }
        }),
        getRecommendedMaterials: builder.query({
            query: (userId) => `/materials/recommend/${userId}`,
            transformResponse: responseData => responseData,
            providesTags: (result, error, arg) => [{ type: 'Material', id: 'RECOMMENDATIONS' }],
        }),
        addNewMaterial: builder.mutation({
            query: initialMaterial => ({
                url: '/materials',
                method: 'POST',
                body: {
                    ...initialMaterial,
                }
            }),
            invalidatesTags: [
                { type: 'Material', id: "LIST" }
            ]
        }),
        updateMaterial: builder.mutation({
            query: initialMaterial => ({
                url: '/materials',
                method: 'PATCH',
                body: {
                    ...initialMaterial,
                }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Material', id: arg.id }
            ]
        }),
        deleteMaterial: builder.mutation({
            query: ({ id }) => ({
                url: `/materials`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Material', id: arg.id }
            ]
        }),
        rateMaterial: builder.mutation({
            query: ({ id, rating, userId }) => ({
                url: `/materials/rate/${id}`,
                method: "PATCH",
                body: { userId, rating },
            }),
        }),
        // TU COŚ SI ZJEBALO
        markAsViewed: builder.mutation({
            query: ({materialId, userId}) => ({
              url: `/materials/view/${materialId}`,
              method: 'PATCH',
              body: { userId },
            }),
          }),
          getViewedMaterials: builder.query({
            query: (userId) => `/users/${userId}/viewedMaterials`,
          }),
    }),
})

export const {
    useGetMaterialsQuery,
    useGetRecommendedMaterialsQuery,
    useAddNewMaterialMutation,
    useUpdateMaterialMutation,
    useDeleteMaterialMutation,
    useRateMaterialMutation,
    useMarkAsViewedMutation,
    useGetViewedMaterialsQuery,
} = materialsApiSlice

// returns the query result object
export const selectMaterialsResult = materialsApiSlice.endpoints.getMaterials.select()

// creates memoized selector
const selectMaterialsData = createSelector(
    selectMaterialsResult,
    materialsResult => materialsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllMaterials,
    selectById: selectMaterialById,
    selectIds: selectMaterialIds
    // Pass in a selector that returns the materials slice of state
} = materialsAdapter.getSelectors(state => selectMaterialsData(state) ?? initialState)