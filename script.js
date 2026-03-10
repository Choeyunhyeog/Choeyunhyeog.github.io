// --- [A] 기존 풀 페이지 스크롤 기능 (새 섹션 반영 업데이트) ---

// 1. 감지할 모든 섹션과 네비게이션 링크들을 찾습니다.
const sections = document.querySelectorAll('section, footer');
const sectionsArray = Array.from(sections);
const navLinks = document.querySelectorAll('header nav a');

let currentSectionIndex = 0;
let isScrolling = false;

// 2. 화면을 감시하는 '관찰자(Observer)' 설정 (메뉴 색상 변경 및 페이드인)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const id = entry.target.getAttribute('id');
            currentSectionIndex = sectionsArray.indexOf(entry.target);
            history.replaceState(null, null, `#${id}`);
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, { threshold: 0.5 });

sections.forEach(section => observer.observe(section));

// 3. 마우스 휠을 직접 제어하여 부드러운 풀 페이지 스크롤 구현
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (isScrolling) return;

    if (e.deltaY > 0) { 
        if (currentSectionIndex < sectionsArray.length - 1) {
            currentSectionIndex++;
        }
    } else { 
        if (currentSectionIndex > 0) {
            currentSectionIndex--;
        }
    }

    isScrolling = true;
    const targetY = sectionsArray[currentSectionIndex].offsetTop - 80;
    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });

    setTimeout(() => {
        isScrolling = false;
    }, 800); 
}, { passive: false });


// --- [B] 기존 이메일 클립보드 자동 복사 및 토스트 알림 기능 (유지) ---

const emailLink = document.getElementById('email-link');
const toast = document.getElementById('toast');

if (emailLink && toast) { // 요소가 있을 때만 실행 (안전)
    emailLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        const myEmail = 'your-email@example.com'; 
        navigator.clipboard.writeText(myEmail).then(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000); // 2초 뒤에 사라짐
        }).catch(err => {
            alert('이메일 복사에 실패했습니다.');
        });
    });
}


// --- [C] 🌋🆕 친구 화산 분출 기능 (새로운 기능!) ---

const eruptBtn = document.getElementById('erupt-btn');
const volcanoContainer = document.getElementById('volcano-container');
// 숨겨둔 친구 사진 리스트 찾기
const friendPhotoSource = document.querySelectorAll('.friend-photo');

if (eruptBtn && volcanoContainer) {
    eruptBtn.addEventListener('click', () => {
        // 친구 한 명당 사진을 5개씩 총 25개 폭발시킵니다. (마음껏 조절 가능)
        for (let i = 0; i < 40; i++) {
            // 원본 사진 중 랜덤으로 하나 선택
            const randomIndex = Math.floor(Math.random() * friendPhotoSource.length);
            const sourceImg = friendPhotoSource[randomIndex];

            // 1. 새로운 이미지 요소를 복사(clone)해서 만듭니다.
            const explodedImg = sourceImg.cloneNode(true);
            explodedImg.classList.remove('friend-photo');
            explodedImg.classList.add('exploded-photo'); // 애니메이션용 클래스 붙임

            // 2. 🌟 더 높이, 더 넓게 솟구치도록 힘 계산 수정
            // --vx: 좌우 퍼짐을 더 넓게 (-300px ~ +300px)
            const vx = (Math.random() - 0.5) * 2000; 
            // --vy: 위로 솟구치는 힘을 약 2배 더 높게! (-600px ~ -1100px)
            const vy = -(Math.random() * 500 + 1600); 
            const delay = Math.random() * 0.3;

            explodedImg.style.setProperty('--vx', `${vx}px`);
            explodedImg.style.setProperty('--vy', `${vy}px`);
            
            // 🌟 애니메이션 지속 시간을 2s에서 4s로 늘려 체공 시간을 길게 만듭니다.
            explodedImg.style.animation = `eruptAnimation 4s ease-out ${delay}s forwards`;

            volcanoContainer.appendChild(explodedImg);

            // 4. 🌟 사진이 화면에 오래 머무르므로, 삭제되는 시간도 2500에서 4500(4.5초)으로 넉넉하게 늘려줍니다.
            setTimeout(() => {
                explodedImg.remove();
            }, 4500);
        }
    });
}