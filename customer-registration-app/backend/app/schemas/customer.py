
from datetime import date

from pydantic import BaseModel, ConfigDict, Field, field_validator


class CustomerCreate(BaseModel):
    """Validate data submitted when registering a customer."""

    model_config = ConfigDict(str_strip_whitespace=True)

    institution: str | None = Field(default=None, max_length=200)
    full_name: str = Field(min_length=1, max_length=200)
    date_of_birth: date | None = None
    gender: str | None = None
    caste: str | None = Field(default=None, max_length=100)
    category: str | None = None
    religion: str | None = Field(default=None, max_length=100)
    standard_occupation: str | None = Field(default=None, max_length=150)
    mobile_no: str | None = Field(default=None, max_length=20)
    city_town: str | None = Field(default=None, max_length=100)
    district: str | None = Field(default=None, max_length=100)
    pincode: str | None = Field(default=None, max_length=6)
    aadhaar_number: str | None = Field(default=None, max_length=12)

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value):
        if not value:
            raise ValueError("Full name cannot be blank")
        return value

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, value):
        if value is not None and value not in {"Male", "Female", "Other"}:
            raise ValueError("Invalid gender")
        return value

    @field_validator("category")
    @classmethod
    def validate_category(cls, value):
        allowed = {"SC", "ST", "OBC", "NT", "SBC", "VJ", "General"}
        if value is not None and value not in allowed:
            raise ValueError("Invalid category")
        return value

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, value):
        if value is not None and value > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return value

    @field_validator("pincode")
    @classmethod
    def validate_pincode(cls, value):
        if value is not None and (
            len(value) != 6 or not value.isdigit()
        ):
            raise ValueError("Pincode must contain exactly 6 digits")
        return value

    @field_validator("aadhaar_number")
    @classmethod
    def validate_aadhaar(cls, value):
        if value is not None and (
            len(value) != 12 or not value.isdigit()
        ):
            raise ValueError("Aadhaar number must contain 12 digits")
        return value
