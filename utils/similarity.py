skills_list = ["python", "c++", "java", "html", "css", "javascript", "sql", "react"]

def analyze(resume, jd):
    resume_words = set(resume.split())
    jd_words = set(jd.split())

    # Score
    common = resume_words.intersection(jd_words)
    score = (len(common) / len(jd_words)) * 100 if jd_words else 0
    score = round(score, 2)

    # Skills
    matched = []
    missing = []

    for skill in skills_list:
        if skill in resume and skill in jd:
            matched.append(skill)
        elif skill in jd and skill not in resume:
            missing.append(skill)

    # Suggestions
    suggestions = []
    if missing:
        suggestions.append("Consider learning: " + ", ".join(missing))
    if score < 50:
        suggestions.append("Add more relevant keywords to your resume")
    if score > 75:
        suggestions.append("Good match! You are well suited for this role")

    return score, matched, missing, suggestions
