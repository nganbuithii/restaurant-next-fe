import http from '@/lib/http';
import { UploadImageResType } from './../schemaValidations/media.schema';
import { useMutation } from '@tanstack/react-query';
import { mediaApiRequest } from '@/apiRequests/media';

export const useUploadmedia = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload
    })
}