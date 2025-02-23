import tableApirequest from "@/apiRequests/tables"
import { UpdateTableBodyType } from "@/schemaValidations/table.schema"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGettableList = () => {
    return useQuery({
        queryKey: ['tableList'],
        queryFn: tableApirequest.list
    })
}

export const useGetDetailtable = ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
        queryKey: ['table', id],
        queryFn: () => tableApirequest.getDetailTable(id),
        enabled
    })
}

export const useAddTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:tableApirequest.addTable,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableList'] })
        }
    })
}

export const useUpdateTable = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
            tableApirequest.updateTable(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableList'], exact: true });
        }
    });
};

export const useDeleteTable= () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => tableApirequest.deleteTable(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tableList'] }); 
        }
    });
};