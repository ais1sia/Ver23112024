import { apiSlice } from '../../app/api/apiSlice';

export const recommendationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        fetchRecommendations: builder.query({
            query: userId => `/recommendations/${userId}`,
        }),
    }),
});

export const { useFetchRecommendationsQuery } = recommendationsApiSlice;
