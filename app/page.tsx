'use client'

import { Button } from "@/components/ui/button"
import React, { useCallback, useEffect, useState } from "react";
import { ArrowLeftIcon, Cross1Icon } from '@radix-ui/react-icons'

const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const limit = 4;

type StatusType = 'accepted' | 'rejected' | 'idle' | 'error';

const statusTheme = {
  accepted: {
    title: "Приятного аппетита",
    color: "bg-success",
    textColor: "text-green-600"
  },
  rejected: {
    title: "Доступ запрещен",
    color: "bg-fail"
  },
  idle: {
    title: "Введите пин-код",
    color: "bg-white"
  },
  error: {
    title: "Произошла ошибка",
    color: "bg-fail"
  },
}

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<StatusType>('idle');

  function requestFullScreen() {
    if (!document?.fullscreenElement) {
      document.documentElement.requestFullscreen();
    }
  }

  useEffect(() => {
    if (status === 'idle') return;

    setTimeout(() => {
      setStatus('idle');
      setCode('');
    }, 1000);
  }, [status])

  const sendCode = useCallback(async () => {
    try {
      const response = await fetch(`http://89.232.236.182:5010/checkaccess/checkbenefits?code=${code}`, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });
      const isSuccess = await response.json();

      if (isSuccess) {
        return setStatus('accepted');
      }
      return setStatus('rejected');

    } catch (error) {
      console.log(error);
    }

  }, [code]);

  useEffect(() => {
    if (code.length === limit) sendCode();
  }, [code, sendCode])

  const setCodeHandler = (num: string) => {
    if (code.length === limit) return;

    setCode(prev => prev + num);
  }

  const reomveLastSymbolHandler = () => {
    setCode(code.substring(-1, code.length - 1));
  }




  const renderForm = () => (
    <>
      <h1 className={`scroll-m-25 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6`}>
        {statusTheme[status].title}
      </h1>
      <div className="bg-white border-2 rounded-xl p-4 w-full max-w-72 text-center">
        <span className={`scroll-m-25 text-4xl font-extrabold tracking-tight lg:text-5xl ${!code.length && 'text-gray-400'}`}>
          {code.length ? code : '0000'}
        </span>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-2 justify-items-center">
        {nums.map((num: string) => {
          const renderContent = () => (
            <Button onClick={() => setCodeHandler(num)} size="xl">
              <span className="text-4xl">{num}</span>
            </Button>
          )

          if (num === '9') {
            return (
              <React.Fragment key={num}>
                {renderContent()}
                <Button onClick={reomveLastSymbolHandler} size="xl">
                  <ArrowLeftIcon width={25} height={25} />
                </Button>
              </React.Fragment>
            )
          }

          if (num === '0') {
            return (
              <React.Fragment key={num}>
                {renderContent()}
                <Button onClick={() => setCode('')} size="xl">
                  <Cross1Icon width={25} height={25} />
                </Button>
              </React.Fragment>
            )
          }

          return <div key={num}>{renderContent()}</div>;
        })}
      </div>
    </>
  )


  const colorClass = `${statusTheme[status].color}`

  return (
    <main className={`${colorClass} flex min-h-screen flex-col items-center lg:p-24`}>
      <div className="absolute left-0 top-0 text-white w-10 h-10" onClick={requestFullScreen}></div>
      <section className="max-w-xl w-full flex flex-col items-center mt-10">
        {renderForm()}
      </section>
    </main>
  );
} 
