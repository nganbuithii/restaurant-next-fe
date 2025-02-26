import authApiRequest from "@/apiRequests/auth"
import indicatorApiRequest from "@/apiRequests/indicator"
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useDashboard = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryFn: () => indicatorApiRequest.getDashboard(queryParams),
        queryKey: ['dashboard', queryParams]

    })
}
