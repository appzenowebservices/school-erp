opencode -s ses_f3c7e0f88ffejFU7tAwi5hK7vN --auto


cd ai-memory/
.\env\Scripts\activate
cd hindsight-api-slim 
python -c "from hindsight_api.main import main; main()" --port 8888


cd ai-memory/
cd hindsight-control-plane
npx next dev --turbopack -p 9999


postgresql://postgres.bqqbceyqpnmhrekvflqr:[YOUR-PASSWORD]@aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
nmJtYxIvAOs7MS3E