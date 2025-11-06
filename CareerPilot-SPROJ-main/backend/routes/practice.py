from fastapi import APIRouter, HTTPException, Query
import json
import random
import os
from typing import Optional

router = APIRouter()

# @router.get("/software")
# async def get_software_questions(
#     difficulty: list[str] = Query(default=["all"]),  # Accept multiple values like ["Medium", "Hard"]
#     limit: int = 10
# ):
#     try:
#         data_path = os.path.join(os.path.dirname(__file__), "../data/software_questions.json")
#         with open(data_path, "r") as f:
#             all_questions = json.load(f)

#         # Normalize difficulty values
#         difficulty = [d.lower() for d in difficulty]

#         # Filter questions
#         if "all" in difficulty:
#             filtered = all_questions
#         else:
#             filtered = [
#                 q for q in all_questions
#                 if q["difficulty"].lower() in difficulty
#             ]

#         random.shuffle(filtered)
#         return {"count": len(filtered[:limit]), "questions": filtered[:limit]}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error loading questions: {str(e)}")

@router.get("/software")
async def get_software_questions(
    difficulty: list[str] = Query(default=["all"]),
    topic: str = Query(default="all"),
    page: int = 1,
    limit: int = 20
):
    try:
        data_path = os.path.join(os.path.dirname(__file__), "../data/software_questions.json")
        with open(data_path, "r") as f:
            all_questions = json.load(f)

        # Normalize difficulty
        difficulty = [d.lower() for d in difficulty]

        # Filter by difficulty
        if "all" in difficulty:
            filtered = all_questions
        else:
            filtered = [q for q in all_questions if q["difficulty"].lower() in difficulty]

        # Filter by topic
        if topic != "all":
            filtered = [q for q in filtered if topic in q.get("topics", [])]

        total_count = len(filtered)

        # Shuffle for randomness
        random.shuffle(filtered)

        # Pagination
        start = (page - 1) * limit
        end = start + limit
        paginated = filtered[start:end]

        return {
            "questions": paginated,
            "totalCount": total_count
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading questions: {str(e)}")

        
@router.get("/datascience-flashcards")
async def get_datascience_flashcards(
    category: Optional[str] = Query(None, description="Filter flashcards by category"),
    limit: int = Query(20, description="Limit number of flashcards returned")
):
    try:
        data_path = os.path.join(os.path.dirname(__file__), "../data/data_science_full_flashcards.json")
        with open(data_path, "r", encoding="utf-8") as f:
            all_cards = json.load(f)

        if category:
            filtered_cards = [card for card in all_cards if card.get("category") == category]
        else:
            filtered_cards = all_cards

        random.shuffle(filtered_cards)
        limited_cards = filtered_cards[:limit]

        return {
            "category": category or "all",
            "count": len(limited_cards),
            "flashcards": limited_cards
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading flashcards: {str(e)}")