import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const materialsAdapter = createEntityAdapter({
    //TODO: sort materials if needed (e. g. lowest to highest rating?)
    //sortComparer: (a, b) => (a.completed === b.completed) ? 0 : a.completed ? 1 : -1
})

const initialState = materialsAdapter.getInitialState()

export const materialsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMaterials: builder.query({
            query: () => '/materials',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
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
    }),
})

export const {
    useGetMaterialsQuery,
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