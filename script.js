// 1. 감지할 모든 섹션과 네비게이션 링크들을 찾습니다.
const sections = document.querySelectorAll('section, footer');
const sectionsArray = Array.from(sections); 
const navLinks = document.querySelectorAll('header nav a');

let currentSectionIndex = 0; // 현재 보고 있는 화면의 순서
let isScrolling = false; // 마우스 휠 연속 입력을 막기 위한 쿨타임 변수

// 2. 화면을 감시하는 '관찰자(Observer)' 설정 (메뉴 색상 변경용)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            // 상단 메뉴를 클릭해서 이동했을 때를 대비해 현재 순서를 동기화합니다.
            currentSectionIndex = sectionsArray.indexOf(entry.target);

            history.replaceState(null, null, `#${id}`);
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

// 3. 마우스 휠을 직접 제어하여 부드러운 풀 페이지 스크롤 구현
window.addEventListener('wheel', (e) => {
    e.preventDefault(); // 브라우저의 거칠고 기본 적인 휠 스크롤을 막습니다.

    if (isScrolling) return; // 화면이 부드럽게 이동 중일 때는 마우스 휠 입력을 무시합니다.

    // 휠을 아래로 굴렸을 때
    if (e.deltaY > 0) { 
        if (currentSectionIndex < sectionsArray.length - 1) {
            currentSectionIndex++;
        }
    } 
    // 휠을 위로 굴렸을 때
    else { 
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
        }
    }

    isScrolling = true;

    // 헤더 높이(80px)를 뺀 정확한 위치로 부드럽게 이동시킵니다.
    const targetY = sectionsArray[currentSectionIndex].offsetTop - 80;
    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });

    // 스크롤 애니메이션이 끝날 때쯤(0.8초 후) 다시 휠을 굴릴 수 있도록 쿨타임을 해제합니다.
    setTimeout(() => {
        isScrolling = false;
    }, 800); 
}, { passive: false });