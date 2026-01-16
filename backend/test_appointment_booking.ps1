# PowerShell script to test appointment booking endpoint
# Replace <PATIENT_TOKEN> with a real JWT token

$token = "<PATIENT_TOKEN>"
$body = @{
    doctor_id = 1
    date = "2026-01-14"
    start_time = "09:00"
    end_time = "09:30"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/appointments/book" `
    -Method Post `
    -Headers @{"accept"="application/json"; "Authorization"="Bearer $token"; "Content-Type"="application/json"} `
    -Body $body

$response | ConvertTo-Json -Depth 5
