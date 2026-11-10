
from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CustomerCreate(BaseModel):
    """Validate data submitted when registering a customer."""

    model_config = ConfigDict(str_strip_whitespace=True)

    # All customer registration fields are required.
    camp_date: date
    sr_no: str = Field(min_length=1, max_length=50)
    institution: str = Field(max_length=200)
    full_name: str = Field(min_length=1, max_length=200)
    date_of_birth: date
    gender: str
    caste: str = Field(max_length=100)
    category: str
    religion: str = Field(max_length=100)
    standard_occupation: str = Field(max_length=150)
    mobile_no: str = Field(max_length=20)
    city_town: str = Field(max_length=100)
    district: str = Field(max_length=100)
    pincode: str = Field(max_length=6)
    aadhaar_number: str = Field(max_length=12)

    @field_validator("camp_date")
    @classmethod
    def validate_camp_date(cls, value):
        if value > date.today():
            raise ValueError("Camp date cannot be in the future")
        return value

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):
        if not value:
            raise ValueError("Full name cannot be blank")
        return value

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value):
        if value not in {"Male", "Female", "Other"}:
            raise ValueError("Invalid gender")
        return value

    @field_validator("category")
    @classmethod
    def validate_category(cls, value):
        allowed = {"SC", "ST", "OBC", "NT", "SBC", "VJ", "General"}
        if value not in allowed:
            raise ValueError("Invalid category")
        return value

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, value):
        if value > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return value

    @field_validator("mobile_no")
    @classmethod
    def validate_mobile(cls, value):
        if (
            len(value) != 10
            or not value.isdigit()
            or value[0] not in "6789"
        ):
            raise ValueError(
                "Mobile number must be 10 digits starting with 6, 7, 8 or 9"
            )
        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value):
        if len(value) != 6 or not value.isdigit():
            raise ValueError("Pincode must contain exactly 6 digits")
        return value

    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar(cls, value):
        if len(value) != 12 or not value.isdigit():
            raise ValueError("Aadhaar number must contain 12 digits")
        return value


class CustomerOut(BaseModel):
    """A customer as returned by the API.

    This model has no validators on purpose: it only describes data that is
    already stored, so it should never reject a row read from the database.
    """

    id: UUID
    camp_date: date
    sr_no: str
    institution: str
    full_name: str
    date_of_birth: date
    age: int  # Calculated from date_of_birth, never stored.
    gender: str
    caste: str
    category: str
    religion: str
    standard_occupation: str
    mobile_no: str
    city_town: str
    district: str
    pincode: str
    aadhaar_number: str
    created_at: datetime
    updated_at: datetime


class CustomerList(BaseModel):
    """One page of customers plus the total number of matches."""

    items: list[CustomerOut]
    total: int
    limit: int
    offset: int
