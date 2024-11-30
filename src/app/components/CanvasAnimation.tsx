"use client";

import { useEffect, useRef } from "react";

type Element = {
    x: number;
    y: number;
    size: number;
    dx: number;
    dy: number;
    draw: (ctx: CanvasRenderingContext2D, time: number) => void;
};

const CanvasAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to fit the viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const elements: Element[] = [];
    const imageSrc = "/puzzle.png"; // 画像のパスを指定
    const image = new Image();
    image.src = imageSrc;

    // オブジェクトの設定
    const createImageElement = (x: number, y: number, s: number, dx: number, dy: number): Element => ({
        x,
        y,
        size: 140 * s,
        dx,
        dy,
        draw: function (ctx: CanvasRenderingContext2D, time: number) {
            this.x += this.dx;
            this.y += this.dy;
        
            // 画面外に出たら位置をリセット
            if (this.x > canvas.width || this.x < 0) this.dx *= -1;
            if (this.y > canvas.height || this.y < 0) this.dy *= -1;
        
            // 画像を描画（timeを使う場合に対応可能）
            ctx.drawImage(image, this.x, this.y, this.size, this.size);
        },
    });

    // 画像がロードされたらオブジェクトを生成
    image.onload = () => {
      for (let i = 0; i < 50; i++) { // 表示する画像の数
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const s = (Math.random() * 3 + 1) / 10; // 大きさをランダムに
        const dx = (Math.random() - 0.5) * 2; // 横方向の速度
        const dy = (Math.random() - 0.5) * 2; // 縦方向の速度
        elements.push(createImageElement(x, y, s, dx, dy));
      }
    };

    // 描画処理
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = new Date().getTime();
      for (const e of elements) {
        e.draw(ctx, time);
      }
      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full bg-[#04BBD3]"
    ></canvas>
  );
};

export default CanvasAnimation;
