import dishApiRequest from "@/apiRequests/dish"
import { wrapServerApi } from "@/lib/utils"
import Image from "next/image"

export default async function DishPage({ params: { id } }: {
    params: {
        id: string
    }
}) {
    
    const data = await wrapServerApi(()=> dishApiRequest.getDetailDish(Number(id)))
    const dish = data?.payload?.data
    if (!dish) {
        return <div>Không tìm thấy món ăn</div>
    }
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800">{dish.name}</h1>
            <Image
                src={dish.image}
                alt={dish.name}
                width={500}
                height={300}
                className="w-full h-64 object-cover rounded-lg mt-4"
            />
            <p className="text-lg text-gray-600 mt-4">{dish.description}</p>
            <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-semibold text-red-500">{dish.price.toLocaleString()} VND</span>
                <span 
                    className={`px-3 py-1 text-sm font-medium rounded-md 
                    ${dish.status === "Available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {dish.status === "Available" ? "Còn hàng" : "Hết hàng"}
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Cập nhật: {new Date(dish.updatedAt).toLocaleString()}</p>
        </div>
    );
}