// camelCase 사용
const answer = "APPLE";

let attempts = 0;
let index = 0;
let answerCount = [false, false, false, false, false];
let interval; //인터벌의 아이디를 가지고 있는 값

function appStart() {
  const displayGameover = () => {
    const maindiv = document.querySelector("body");
    const width = maindiv.offsetWidth;
    const height = maindiv.offseHeight;
    const div = document.createElement("div");
    div.innerText = "게임이 종료되었습니다.";
    div.style = `display:flex; justify-content:center; align-items:center; position:absolute; top:40vh; left:40vw; background-color:rgba(255, 0, 0, 0.5); font-size:20px; width:200px; height:70px`;
    document.body.appendChild(div);
  };
  const gameOver = () => {
    window.removeEventListener("keydown", handleKeyDown);
    displayGameover();
    clearInterval(interval); //인터벌 변수에 저장된 인터벌 삭제
  };

  const nextLine = () => {
    attempts++;
    index = 0;

    if (attempts === 6) return gameOver();
  };

  const keypadAnimation = (thisKeypad) => {
    thisKeypad.animate([{ background: "#484b4c", color: "white" }], {
      easing: "ease-in-out",
      duration: 150,
    });
  };

  const blockAnimation = (thisblock) => {
    thisblock.animate(
      //enter, backspace와 겹치지 않기 위해 영문키 눌렀을때 조건문에 애니메이션 삽입
      //키를 눌렀을때 애니메이션
      [
        // key frames
        { transform: "translateY(0px)" }, //시작위치
        { transform: "translateY(-10px)" }, //도착위치
      ],
      { duration: 100, iterations: 1 } //지속시간, 반복횟수
    );
  };

  const handleBackspace = () => {
    if (index > 0) {
      const preBlock = document.querySelector(
        `.boardBlock[data-index='${attempts}${index - 1}']`
      );
      preBlock.innerText = "";
      index--;
    }
  };

  const handleEnterkey = () => {
    if (index < 5) return;
    for (let i = 0; i < 5; i++) {
      // 엔터키 눌렀을때 블럭 한줄씩 검사하기
      const block = document.querySelector(
        `.boardBlock[data-index='${attempts}${i}']`
      ); // 입력한 키의 board 부분
      const enterAnswer = block.innerText;
      //block의 text
      const blockKey = document.querySelector(
        `.keyboard-column[data-key='${enterAnswer}']`
      ); // 입력한 값의 키패드 부분

      if (answer[i] === enterAnswer) {
        //블럭과 정답이 자리와 글자도 일치할때
        block.style.background = "#6AA964"; //스타일 지정
        blockKey.style.background = "#6AA964";
        answerCount[i] = true;
      } else if (answer.includes(enterAnswer)) {
        //자리만 틀릴때
        block.style.background = "#c9b458";
        blockKey.style.background = "#c9b458";
      } else {
        //아예 틀릴때
        block.style.background = "#787C7E";
        blockKey.style.background = "#787C7E";
      }
    }

    if (answerCount.every((answerCount) => answerCount === true)) {
      gameOver();
    } else nextLine();
  };

  const handleKeyDown = (event) => {
    const key = event.key.toUpperCase(); //입력한 키의 값 대문자로
    const keyCode = event.keyCode; // 입력한 키의 키 코드(숫자)
    const thisBlock = document.querySelector(
      `.boardBlock[data-index='${attempts}${index}']`
    ); //입력된 블럭 값
    const thisKeypad = document.querySelector(
      `.keyboard-column[data-key='${key}']`
    );

    if (key === "BACKSPACE") handleBackspace();
    else if (index === 5) {
      if (key === "ENTER") handleEnterkey();
      else return;
    } else if ("a" <= event.key && event.key <= "z") {
      // 키가 알파벳일때만
      thisBlock.innerText = key;
      index++;
      keypadAnimation(thisKeypad);
      blockAnimation(thisBlock);
    }
  };

  const startTimer = () => {
    //타이머 설정
    const startTime = new Date(); //시작 시각 저장
    function setTime() {
      const curTime = new Date(); //현재 시각 저장
      const timer = new Date(curTime - startTime); //현재시간에서 시작시간을 뺀 만큼 경과시간에 저장
      const min = timer.getMinutes().toString().padStart(2, "0"); //getMinutes함수를 통해 '분'을 불러와 스트링으로 변환 후 두자리 출력 및 빈자리는 0으로 채움
      const sec = timer.getSeconds().toString().padStart(2, "0"); //getSeconds함수를 통해 '초'을 불러와 스트링으로 변환 후 두자리 출력 및 빈자리는 0으로 채움

      const timeH1 = document.querySelector(".timer"); //html에 있는 타이머 div를 불러와 저장
      timeH1.innerText = "time " + `${min}:${sec}`; //위에 저장한 시간 변수를 text로 변환하여 출력
    }
    interval = setInterval(setTime, 1000); //반복 지정, 1000ms=1s마다 setTime 함수 호출
  };

  startTimer(); //타이머 시작
  window.addEventListener("keydown", handleKeyDown);
}

appStart();
