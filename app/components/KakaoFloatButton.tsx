import { KAKAO_OPENCHAT_URL } from '@/lib/contact';

/**
 * 카카오 1:1 상담 플로팅 버튼.
 * PublicShell footer 다음에 마운트되어 모든 공개 페이지에 노출.
 */
export default function KakaoFloatButton() {
  return (
    <>
      <a
        href={KAKAO_OPENCHAT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="kakao-float-btn"
        aria-label="카카오 오픈채팅 상담"
        title="카카오 오픈채팅으로 1:1 상담"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 3C6.477 3 2 6.589 2 11c0 2.713 1.574 5.117 4 6.663V21l3.5-2.1A11.5 11.5 0 0 0 12 19c5.523 0 10-3.589 10-8s-4.477-8-10-8z"/>
        </svg>
        <span className="kakao-float-label">1:1 상담</span>
      </a>

      <style>{`
        .kakao-float-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 50;
          display: flex;
          align-items: center;
          gap: 8px;
          background: #FEE500;
          color: #3A1D1D;
          padding: 12px 18px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          box-shadow: 0 4px 20px rgba(254,229,0,0.4), 0 2px 8px rgba(0,0,0,0.15);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }
        .kakao-float-btn:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 8px 28px rgba(254,229,0,0.5), 0 4px 12px rgba(0,0,0,0.15);
        }
        .kakao-float-btn:active {
          transform: translateY(-1px) scale(0.98);
        }
        @media (max-width: 640px) {
          .kakao-float-btn {
            bottom: 20px;
            right: 16px;
            padding: 10px 14px;
            font-size: 13px;
          }
        }
      `}</style>
    </>
  );
}
