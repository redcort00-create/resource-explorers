# 지구를 잇는 탐구실

**학생용 홈페이지: https://redcort00-create.github.io/resource-explorers/**

초등학교 5학년 2학기 과학 「4. 자원과 에너지」, 교과서 94~95쪽 및 실험관찰 60~61쪽의 조사 활동에 맞춘 홈페이지입니다.

- 홈에서 물 자원, 산림 자원, 광물 자원, 에너지를 선택합니다.
- 주제마다 5개 읽기 단락, 자체 제작 설명 그림, 핵심 낱말, 비교·과정 도해, 생각 질문이 있습니다.
- 조사 결과를 6개 항목으로 기록하고 텍스트 파일로 내려받거나 복사·인쇄할 수 있습니다.
- 각 주제의 마지막에는 관련 YouTube 영상과 시청 질문을 넣었습니다.
- 로그인·학생 정보 수집·서버 제출 기능은 없습니다. 기록은 현재 브라우저의 localStorage에만 저장됩니다. 공용 기기에서는 앞 학생의 기록이 보일 수 있습니다.

## 실행

`dist/index.html`을 열면 글·그림과 기록 기능을 이용할 수 있습니다. YouTube 외부 재생은 HTTP/HTTPS 주소에서 확인해야 합니다. 파일로 직접 연 경우나 학교 네트워크, 영상 업로더 설정에 따라 재생되지 않을 수 있습니다.

Node.js 22 이상이 있는 경우:

```sh
npm run build
npm run check
npm run preview
```

미리보기 주소: http://127.0.0.1:4173

## GitHub Pages 게시

1. 이 프로젝트 전용 GitHub 저장소를 만듭니다. 무료 GitHub Pages를 사용하려면 일반적으로 공개 저장소를 이용합니다.
2. 이 폴더 안의 파일을 저장소의 `main` 브랜치에 올립니다. 원본 수업 PPT나 교과서 파일은 올릴 필요가 없습니다.
3. 저장소 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
4. **Actions → Publish classroom site → Run workflow**를 실행합니다. 이후 `main` 브랜치를 수정하면 자동으로 다시 게시됩니다.
5. 성공 후 배포 결과의 홈페이지 주소를 학생들에게 안내합니다.

빌드 결과물인 `dist`도 포함되어 있어 별도 설치 없이 사용할 수 있습니다. 모든 내부 링크는 상대 경로라 GitHub Pages의 저장소 하위 주소에서도 동작합니다. 외부 글꼴이나 화면 표시용 라이브러리를 불러오지 않습니다.

## 수정

- 읽기 자료와 영상: `src/content.mjs`
- 설명 그림: `src/illustrations.mjs`
- 디자인: `src/style.css`
- 기록 저장·내려받기·인쇄: `src/app.js`
- HTML 생성: `scripts/build.mjs`

수정한 뒤 `npm run build`와 `npm run check`를 실행합니다.

## 자료·그림·영상

자료 확인일: 2026-11-05. 수업 PPT의 분류와 활동 흐름을 참고하고, 기관의 공개 자료와 일반 과학 원리를 바탕으로 새로운 읽기 글을 작성했습니다. 본문에 원문 문장을 길게 옮기거나 교과서·PPT 이미지를 복제하지 않았습니다. 참고한 원문과 확인 메모는 `src/content.mjs`에 보관합니다. 절감 비용과 오래된 수치는 사용하지 않았습니다.

SVG 그림은 이 사이트를 위해 제작한 학습 도해입니다. 실제 시설의 축척·설계도가 아닙니다.

영상은 YouTube 공식 외부 플레이어로 삽입했습니다. 영상 파일을 복제하거나 재배포하지 않습니다. 재생 권한은 업로더 설정에 따라 바뀔 수 있습니다. 실제 외부 재생 검증 결과는 `VERIFICATION.md`에 기록합니다.

## 숲가꾸기 실제 참고 사진

산림 자원 03번 소주제에 미국 산림청 연구림의 실제 사진 2장을 넣었습니다. 사진은 각각 다른 지점의 솎아베기 전·후 사례이며 동일한 장소의 시점 비교가 아닙니다. 사진은 잘라내지 않고 원본 비율로 표시합니다.

- 출처: [USDA Forest Service · Photo Tour: Variable Density Thinning Study](https://research.fs.usda.gov/psw/products/multimedia/photos/photo-tour-variable-density-thinning-study)
- 원본: psw-vdpt001.jpg(작업 전), psw-vdpt007.jpg(솎아베기 뒤)
- 사진 파일: src/photos/ 및 dist/assets/photos/
- 각 사진 설명, 대체 텍스트, 원문 출처 링크, 크게 보기 링크를 제공합니다.


## 홈 대표 그림

홈 대표 그림은 사용자가 제공한 에너지 절약 주택 그림을 편집한 이미지입니다. 말주머니와 문장을 제거하고, 왼쪽 위 단열재 단면과 실제 벽을 잇는 점선·위치 표시는 유지했습니다. 파일은 src/assets/home-energy-house-wall-link.jpg이며 빌드 시 dist/assets/에 복사합니다.
