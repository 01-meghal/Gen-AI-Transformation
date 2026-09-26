import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "Welcome" in response.json()["message"]

def test_get_current_user():
    response = client.get("/api/v1/users/me")
    assert response.status_code == 200
    data = response.json()
    assert "email" in data
    assert data["role"] == "admin"

def test_get_projects():
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_text_ingestion():
    payload = {
        "title": "Quarterly Financial Analysis Briefing",
        "text": "Quarterly revenue increased by 35% year-over-year reaching $12.5M. Operating margins improved by 420 basis points due to automation initiatives. Key risks include supply chain inflation and talent retention. Recommended action: Accelerate AI adoption in enterprise workflows.",
        "project_id": 1,
        "workspace_id": 1
    }
    response = client.post("/api/v1/sources/text", json=payload)
    assert response.status_code == 201
    source_data = response.json()
    assert source_data["status"] == "ready"
    assert source_data["word_count"] > 0
    assert source_data["chunk_count"] > 0

    source_id = source_data["id"]

    # Read blocks & claims
    blocks_resp = client.get(f"/api/v1/sources/{source_id}/blocks")
    assert blocks_resp.status_code == 200
    assert len(blocks_resp.json()) > 0

    claims_resp = client.get(f"/api/v1/sources/{source_id}/claims")
    assert claims_resp.status_code == 200
    assert len(claims_resp.json()) > 0

def test_full_transformation_flow():
    # 1. Ingest
    payload = {
        "title": "AI Strategic Directive 2026",
        "text": "Our enterprise directive mandates adopting modular LLM architectures. Key finding: AI transformations reduce content delivery latency by 65%. Critical recommendation: Mandate rigorous automated quality guardrails and human-in-the-loop review queues.",
        "project_id": 1,
        "workspace_id": 1
    }
    source_resp = client.post("/api/v1/sources/text", json=payload)
    assert source_resp.status_code == 201
    source_id = source_resp.json()["id"]

    # 2. Transform into Executive Summary & LinkedIn Post
    transform_req = {
        "targets": ["executive_summary", "linkedin_post", "twitter_x", "advisory", "infographic_spec", "presentation", "video_package"],
        "configuration": {
            "audience": "executives",
            "tone": "professional",
            "language": "en"
        }
    }
    t_resp = client.post(f"/api/v1/sources/{source_id}/transformations", json=transform_req)
    assert t_resp.status_code == 200
    batch_data = t_resp.json()
    assert len(batch_data["outputs"]) == 7

    output_id = batch_data["outputs"][0]["output_id"]

    # 3. Get Output detail
    out_resp = client.get(f"/api/v1/outputs/{output_id}")
    assert out_resp.status_code == 200
    assert out_resp.json()["current_version_id"] is not None

    version_id = out_resp.json()["current_version_id"]

    # 4. Review approval
    review_req = {
        "decision": "approved",
        "comment": "Verified source grounding and quality metrics. Approved for distribution."
    }
    rev_resp = client.post(f"/api/v1/output-versions/{version_id}/reviews", json=review_req)
    assert rev_resp.status_code == 200
    assert rev_resp.json()["decision"] == "approved"

    # 5. Export download
    dl_resp = client.get(f"/api/v1/output-versions/{version_id}/download?format=md")
    assert dl_resp.status_code == 200
    assert "#" in dl_resp.text
