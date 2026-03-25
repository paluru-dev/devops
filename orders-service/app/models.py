
from pydantic import BaseModel, Field


class Order(BaseModel):
    product:str = Field(..., description="The name of the product being ordered")
    price: float = Field(..., description="The price of the product being ordered")
    quantity: int = Field(default=1, description="The quantity of the product being ordered")
    
class OrderResponse(Order):
    id: str | None = Field(default=None, description="The unique identifier for the order")  