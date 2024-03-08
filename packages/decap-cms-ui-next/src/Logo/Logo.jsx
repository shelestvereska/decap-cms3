import React from 'react';
import styled from '@emotion/styled';

const StyledPath = styled.path`
  ${({ theme }) => (theme.darkMode ? `fill: white;` : ``)}
`;

function Logo({ className = '', size = '32px', src }) {
  return (
    <>
      {src ? (
        <img src={src} alt="Logo" width={size} height={size} className={className} />
      ) : (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <defs>
            <linearGradient x1="50%" y1="0%" x2="103.216038%" y2="50%" id="linearGradient-1">
              <stop stopColor="#35ADB1" offset="0%" />
              <stop stopColor="#4C9ABE" offset="100%" />
            </linearGradient>
          </defs>
          <StyledPath
            d="M23.2,11.0954774 L23.12,11.0150754 L23.76,6.99497487 L26.8,10.0502513 L23.68,11.4170854 L23.6,11.4170854 L23.2,11.0954774 Z M27.6,10.8542714 L30.8,14.0703518 C31.52,14.7939698 31.84,15.1155779 31.92,15.5175879 L32,15.678392 L24.24,12.3819095 L24.16,12.3015075 L24.24,12.2211055 L27.6,10.8542714 Z M31.84,16.7236181 C31.68,17.0452261 31.36,17.3668342 30.8,17.9296482 L27.2,21.5477387 L22.48,20.5829146 L22.4,20.5829146 L22.32,20.5025126 C22.32,20.1005025 22.08,19.7788945 21.76,19.5376884 L21.76,19.4572864 L22.64,13.9899497 L22.64,13.9095477 L22.72,13.8291457 C23.12,13.8291457 23.44,13.5879397 23.68,13.2663317 L23.84,13.2663317 L31.84,16.7236181 Z M26.32,22.4321608 L20.32,28.4623116 L21.36,22.1105528 L21.44,22.0301508 L22,21.6281407 L22.08,21.5477387 L26.32,22.4321608 Z M19.04,29.7487437 L18.4,30.3919598 L10.88,19.5376884 L10.88,19.4572864 L10.96,19.2964824 L11.04,19.2160804 L11.12,19.2160804 L19.36,20.9849246 L19.44,20.9849246 L19.44,21.0653266 C19.6,21.4673367 19.92,21.8693467 20.32,22.0301508 L20.32,22.1105528 L19.04,29.7487437 Z M17.68,31.1155779 C17.12,31.5979899 16.88,31.919598 16.48,32 L15.52,32 C15.12,31.839196 14.8,31.5175879 14.08,30.8743719 L6.56,23.3165829 L8.56,20.2613065 L8.64,20.2613065 C9.11324471,20.4154279 9.62665411,20.3867619 10.08,20.1809045 L10.16,20.1809045 L17.68,31.1155779 L17.68,31.1155779 Z M5.84,22.5929648 L4.16,20.9045226 L7.52,19.3768844 L7.6,19.3768844 L7.68,19.4572864 L7.76,19.6180905 L7.76,19.6984925 L5.84,22.5929648 Z M3.36,20.1005025 L1.2,17.9296482 L0.4,17.0452261 L7.04,18.4120603 L7.12,18.4924623 L7.04,18.5728643 L3.36,20.1005025 Z M0,15.919598 L0.08,15.5175879 C0.16,15.1155779 0.56,14.7939698 1.2,14.0703518 L4,11.2562814 C5.27650833,13.1347322 6.55651057,15.0107824 7.84,16.8844221 L7.92,16.9648241 C7.76563256,17.1067651 7.63107927,17.2690404 7.52,17.4472362 L7.44,17.4472362 L0,15.919598 Z M4.72,10.5326633 L8.48,6.75376884 L11.28,7.95979899 C11.947336,8.2530751 12.6140044,8.54788324 13.28,8.84422111 L13.2,9.24623116 C13.2,9.64824121 13.36,10.0502513 13.68,10.3718593 L13.68,10.5326633 L9.84,16.4020101 L9.84,16.4824121 L9.76,16.4824121 L9.28,16.4020101 L8.88,16.4824121 L8.8,16.4824121 L8.8,16.4020101 L4.72,10.5326633 L4.72,10.5326633 Z M9.28,6.03015075 L14.08,1.12562814 C14.8,0.48241206 15.12,0.16080402 15.52,0 L16.48,0 C16.88,0.16080402 17.28,0.48241206 17.92,1.12562814 L18.96,2.17085427 L15.52,7.55778894 L15.52,7.63819095 L15.44,7.63819095 L14.88,7.55778894 C14.48,7.55778894 14.08,7.63819095 13.84,7.87939698 L13.68,7.87939698 L9.28,6.03015075 Z M19.68,2.89447236 L22.88,6.11055276 L22.16,10.9346734 L22.08,10.9346734 L22.08,11.0150754 C21.907032,11.0662294 21.7444993,11.1479041 21.6,11.2562814 L21.52,11.2562814 L16.64,9.16582915 L16.56,9.08542714 C16.5309036,8.83008003 16.4491651,8.58363231 16.32,8.36180905 L16.32,8.20100503 L19.68,2.89447236 Z M16.4,10.1306533 L20.96,12.0603015 L21.04,12.1407035 L21.04,12.5427136 L20.96,12.6231156 L10.8,16.9648241 L10.72,16.8844221 L10.8,16.8040201 L14.56,11.0150754 L14.64,10.9346734 L14.88,10.9346734 C15.4667716,10.9377982 16.0126474,10.63301 16.32,10.1306533 L16.4,10.1306533 L16.4,10.1306533 Z M11.2,17.8492462 L21.44,13.4271357 L21.52,13.5075377 L21.6,13.5879397 L21.68,13.5879397 L21.68,13.6683417 L20.8,19.1356784 L20.8,19.2160804 C20.32,19.2160804 19.84,19.5376884 19.6,19.9396985 L19.6,20.0201005 L19.52,20.0201005 L11.36,18.2512563 L11.2,17.8492462 Z"
            id="logomark"
            fill="url(#linearGradient-1)"
            fillRule="nonzero"
          />
        </svg>
      )}
    </>
  );
}

export default Logo;
