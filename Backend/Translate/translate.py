import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def traducir(text, source, target):
    # Credenciales de AWS
    aws_access_key_id = os.getenv("TRANSLATE_ACCESS_KEY_ID")
    aws_secret_access_key = os.getenv("TRANSLATE_SECRET_ACCESS_KEY")

    trans_client = boto3.client('translate', aws_access_key_id=aws_access_key_id, 
                        aws_secret_access_key=aws_secret_access_key, region_name='us-east-1')

    response = trans_client.translate_text(
        Text=text,
        SourceLanguageCode=source,
        TargetLanguageCode=target
    )

    translated_text = response['TranslatedText']
    return {'translated_text': translated_text}