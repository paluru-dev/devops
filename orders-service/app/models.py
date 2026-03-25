from pydantic import BaseModel, Field
from typing import Optional 

class Order(BaseModel):
    product:str = Field(..., description="The name of the product being ordered")
    price: float = Field(..., description="The price of the product being ordered")
    quantity: int = Field(default=1, description="The quantity of the product being ordered")
    
class OrderResponse(Order):
    id: Optional[str] = Field(default=None, description="The unique identifier for the order")  