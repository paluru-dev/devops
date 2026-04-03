from bson import ObjectId
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .database import orders_collection
from .models import Order

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5173",
        "http://18.219.61.156:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "Orders API running"}


@app.post("/orders")
async def create_order(order: Order):
    order_dict = order.model_dump()
    result = await orders_collection.insert_one(order_dict)
    return {"id": str(result.inserted_id)}


@app.get("/orders")
async def get_orders():
    orders = []
    async for order in orders_collection.find():
        order["id"] = str(order["_id"])
        del order["_id"]
        orders.append(order)
    return orders


@app.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await orders_collection.find_one({"_id": ObjectId(order_id)})

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["id"] = str(order["_id"])
    del order["_id"]
    return order


@app.put("/orders/{order_id}")
async def update_order(order_id: str, order: Order):
    order_dict = order.model_dump()

    result = await orders_collection.update_one({"_id": ObjectId(order_id)}, {"$set": order_dict})

    if result.matched_count == 1:
        return {"message": "Order updated successfully"}

    raise HTTPException(status_code=404, detail="Order not found")


@app.delete("/orders/{order_id}")
async def delete_order(order_id: str):
    result = await orders_collection.delete_one({"_id": ObjectId(order_id)})

    if result.deleted_count == 1:
        return {"message": "Order deleted"}

    raise HTTPException(status_code=404, detail="Order not found")
