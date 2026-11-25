import os
import shutil
import zipfile

def package_submission():
    base_dir = r"C:\Users\Sumsung\.gemini\antigravity\scratch\mediguard-mern"
    submission_dir = os.path.join(base_dir, "Project_Submission_Package")
    os.makedirs(submission_dir, exist_ok=True)

    # 1. Copy PPTX
    pptx_src = os.path.join(base_dir, "docs", "MediGuard_Software_Engineering_Presentation.pptx")
    pptx_dest = os.path.join(submission_dir, "MediGuard_Presentation_4_Slides.pptx")
    if os.path.exists(pptx_src):
        shutil.copy2(pptx_src, pptx_dest)
        print("Copied PPTX")

    # 2. Copy SRS
    srs_src = os.path.join(base_dir, "docs", "SRS_Document_MediGuard.md")
    srs_dest = os.path.join(submission_dir, "SRS_Document_IEEE_830_MediGuard.md")
    if os.path.exists(srs_src):
        shutil.copy2(srs_src, srs_dest)
        print("Copied SRS")

    # 3. Copy Viva QA Guide
    viva_src = os.path.join(base_dir, "docs", "Professor_Viva_4_Member_QA_Guide.md")
    viva_dest = os.path.join(submission_dir, "Professor_Viva_Defense_4_Members.md")
    if os.path.exists(viva_src):
        shutil.copy2(viva_src, viva_dest)
        print("Copied Viva Guide")

    # 4. Create Source Code ZIP (excluding node_modules, .git, .vercel)
    zip_path = os.path.join(submission_dir, "MediGuard_Source_Code.zip")
    exclude_dirs = {"node_modules", ".git", ".vercel", "dist", "Project_Submission_Package"}
    
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(base_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for file in files:
                if file.endswith((".log", ".tmp")) or file == ".env" or file.startswith(".env.") and not file.endswith(".example"):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, base_dir)
                zipf.write(file_path, arcname)

    print(f"Source code archived: {zip_path}")
    print(f"All 3 components packaged in: {submission_dir}")

if __name__ == "__main__":
    package_submission()
