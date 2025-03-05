# Ryan-s-World
UPCSG Hackathon 2025 Repository
Members:
Rusell Lorenz Beduya    BSCS I
Ryan Anthony Retutal    BSCS I
John Dexter Rico        BSCS I
Hans Therese Ponce      BSCS I
George Kristan Señagan  BSCS I


CertifBAI makes use PDFco and Google Generative AI to help evaluate an individual's resume to assess their job fit, providing insights into their suitability for various roles in the industry. It uses a database containting the qualifications and skills of people in different jobs to help
our AI to make better assessments.

How to setup certifBAI:
1. Download or CLone the github repository.
2. Run npm install in the terminal.
3. Generate an API key from PDFco and Google Generative AI.
4. Create a .env file with the same directory level as of the folder of the git hub repository.
   
6. Put this in the .env file: VITE_PDF_CO_API_KEY=<your API key here>
                              VITE_GOOGLE_API_KEY=<your API key here>
                              
7. Run the file named "server.js" in the proxy-server folder (you have to change directory).
8. Do npm run dev in the main directory to run the website.

The website should now be up and running!


