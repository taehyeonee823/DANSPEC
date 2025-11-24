from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import pymysql
from pymysql.cursors import DictCursor
from typing import Optional
import logging
import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

# 로깅 설정
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인으로 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MySQL 연결 설정
def get_db_connection():
    return pymysql.connect(
        host=os.getenv('DB_HOST', 'localhost'),
        user=os.getenv('DB_USER', 'root'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME', 'board_db'),
        charset=os.getenv('DB_CHARSET', 'utf8mb4'),
        cursorclass=DictCursor
    )

# 회원가입 요청 모델
class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    campus: str
    department: str
    major: str
    grade: Optional[str] = None
    introduction: str

# 이메일 확인 요청 모델
class EmailCheckRequest(BaseModel):
    email: EmailStr

# 로그인 요청 모델
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@app.get("/")
def read_root():
    return {"message": "FastAPI 서버가 정상적으로 실행 중입니다"}

# 회원가입 API
@app.post("/api/signup")
async def signup(signup_data: SignupRequest):
    # 필수 항목 검증 (Pydantic이 자동으로 처리)
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO userinfo (email, password, name, campus, department, major, grade, introduction, created_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, NOW())
        """

        cursor.execute(
            query,
            (signup_data.email, signup_data.password, signup_data.name,
             signup_data.campus, signup_data.department, signup_data.major,
             signup_data.grade, signup_data.introduction)
        )
        connection.commit()
        user_id = cursor.lastrowid

        cursor.close()
        connection.close()

        logger.info(f"회원가입 성공: {signup_data.email}")
        return {
            "success": True,
            "message": "회원가입이 완료되었습니다!",
            "userId": user_id
        }

    except pymysql.err.IntegrityError as e:
        logger.error(f"중복 이메일 오류: {signup_data.email}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail={
                "success": False,
                "message": "이미 등록된 이메일입니다."
            }
        )
    except Exception as e:
        logger.error(f"회원가입 오류: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "회원가입 중 오류가 발생했습니다."
            }
        )

# 이메일 중복 확인 API
@app.post("/api/check-email")
async def check_email(email_data: EmailCheckRequest):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT email FROM userinfo WHERE email = %s"
        cursor.execute(query, (email_data.email,))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if result:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail={
                    "success": False,
                    "message": "이미 사용 중인 이메일입니다."
                }
            )

        return {
            "success": True,
            "message": "사용 가능한 이메일입니다."
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"이메일 확인 오류: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "서버 오류가 발생했습니다."
            }
        )

# 로그인 API
@app.post("/api/login")
async def login(login_data: LoginRequest):
    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        query = "SELECT id, email, name, campus, department, major, grade FROM userinfo WHERE email = %s AND password = %s"
        cursor.execute(query, (login_data.email, login_data.password))
        result = cursor.fetchone()

        cursor.close()
        connection.close()

        if not result:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={
                    "success": False,
                    "message": "이메일 또는 비밀번호가 올바르지 않습니다."
                }
            )

        logger.info(f"로그인 성공: {login_data.email}")
        return {
            "success": True,
            "message": "로그인이 완료되었습니다.",
            "user": {
                "id": result['id'],
                "email": result['email'],
                "name": result['name'],
                "campus": result['campus'],
                "department": result['department'],
                "major": result['major'],
                "grade": result['grade']
            }
        }

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"로그인 오류: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "success": False,
                "message": "로그인 중 오류가 발생했습니다."
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=6000)
