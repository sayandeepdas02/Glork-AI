from fastapi import APIRouter

from app.api.v1 import auth, bookings, calendar, calls, doctors, retell

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(doctors.router)
api_router.include_router(bookings.router)
api_router.include_router(calls.router)
api_router.include_router(retell.router)
api_router.include_router(calendar.router)
