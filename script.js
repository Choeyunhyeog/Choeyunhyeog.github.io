// --- [A] 기존 풀 페이지 스크롤 기능 (새 섹션 반영 업데이트) ---

// 1. 감지할 모든 섹션과 네비게이션 링크들을 찾습니다.
const sections = document.querySelectorAll('section, footer');
const sectionsArray = Array.from(sections);
const navLinks = document.querySelectorAll('header nav a');

let currentSectionIndex = 0;
let isScrolling = false;

// 2. 화면을 감시하는 '관찰자(Observer)' 설정 (메뉴 색상 변경 및 페이드인)F
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
        const myEmail = 'choeyunhyeog8@gmail.com'; 
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

// --- [C] 친구 소개 무한 스크롤 동적 생성 (리팩터링) ---

const track1 = document.getElementById('track1');
const track2 = document.getElementById('track2');
const track3 = document.getElementById('track3');

if (track1 && track2 && track3) {
    // 🌟 교체 포인트: 나중에 사진을 바꿀 땐 파일 이름만 여기서 수정하세요!
    const photos = [
        'images/park1.jpg',
        'images/park2.jpg',
        'images/park3.jpg',
        'images/park4.jpg',
        'images/park5.jpg'
    ];

    // 사진 순서를 약간씩 섞어주는 함수 (줄마다 다른 느낌을 주기 위함)
    const getOffsetArray = (arr, offset) => {
        return [...arr.slice(offset), ...arr.slice(0, offset)];
    };

    // 트랙에 사진을 채워 넣는 함수
    const createTrackImages = (track, photoArray) => {
        // 🌟 핵심: 울트라 와이드 모니터에서도 가로가 텅 비지 않도록, 배열을 10번 반복해서 아주 길게(총 50장) 만듭니다!
        for (let i = 0; i < 20; i++) {
            photoArray.forEach(photoSrc => {
                const img = document.createElement('img');
                img.src = photoSrc;
                img.className = 'crew-photo';
                img.alt = 'friend photo';
                track.appendChild(img);
            });
        }
    };

    // 1번 줄: 원본 순서대로 생성
    createTrackImages(track1, photos);
    // 2번 줄: 순서를 2칸 미뤄서 섞기
    createTrackImages(track2, getOffsetArray(photos, 2));
    // 3번 줄: 순서를 4칸 미뤄서 섞기
    createTrackImages(track3, getOffsetArray(photos, 4));
}