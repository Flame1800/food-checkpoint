'use client'

import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, Cross1Icon } from '@radix-ui/react-icons'

const nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const limit = 4;

type StatusType = 'accepted' | 'rejected' | 'idle';

export default function Home() {
  const [code, setCode] = useState<string>('');
  const [status, setStatus] = useState<StatusType>('idle');

  useEffect(() => {
    if (status === 'idle') return;

    setTimeout(() => {
      setStatus('idle');
      setCode('');
    }, 3000);
  }, [status])

  const setCodeHandler = (num: string) => {
    if (code.length === limit) return;
    setCode(prev => prev + num);
  }

  const reomveLastSymbolHandler = () => {
    setCode(code.substring(-1, code.length - 1));
  }

  const sendCodeHandler = () => {
    if (code === '0000') {
      return setStatus('rejected');
    }
    setStatus('accepted');
  }

  const renderForm = () => (
    <>
      <h1 className="scroll-m-25 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
        Введите пин код
      </h1>
      <div className="border-2 rounded-xl p-4 w-full max-w-72 text-center">
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
      {code.length === 4 && (
        <Button onClick={sendCodeHandler} className="mt-6 text-xl py-8 px-12 bg-green-600 hover:bg-green-500">
          Продолжить
          <ArrowRightIcon className="ml-4" width={25} height={25} />
        </Button>
      )}
    </>
  )

  const rederAcceptInfo = () => (
    <h1 className="scroll-m-25 text-green-600 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
      Доступ разрешен
    </h1>
  )

  const rederRejectInfo = () => (
    <h1 className="scroll-m-25 text-red-600 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mb-6">
      Доступ запрещен
    </h1>
  )

  
  return (
    <main className="flex min-h-screen flex-col items-center lg:p-24">
      <section className="max-w-xl w-full flex flex-col items-center mt-10">
        {status === 'idle' && renderForm()}
        {status === 'accepted' && rederAcceptInfo()}
        {status === 'rejected' && rederRejectInfo()}
      </section>
    </main>
  );
} 
