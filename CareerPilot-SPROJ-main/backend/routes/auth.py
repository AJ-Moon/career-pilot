from fastapi import APIRouter, HTTPException, Request, Depends
from config import db, clerk
router = APIRouter(tags=["Auth"])


