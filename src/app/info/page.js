"use client";

import React from "react";

const Helppage = () => {
  return (
    <div className="flex flex-col gap-8 bg-gray-800 text-center p-8">
      <div className="flex flex-col  justify-center items-center gap-10 mt-6">
        <h1 className="text-xl text-purple-800 font-bold">Ինչպես օգտվել</h1>
        <em className="text-gray-100 font-semibold">
          1 Նախքան գրանցվելը գլխավոր էջում դիտել Տեսածանոթությունը
        </em>
        <em className="text-gray-100 font-semibold">
          2 Էկրանի վերին ձախ անկյունում գտնվող ցանկը բացելու նշանով բացել ցանկը
        </em>
        <em className="text-gray-100 font-semibold">
          3 Free բաճնում դասերի 4 մակարդակներից և Images բաճնից կան անվճար դասեր
          կայքին և դասերի ընթացակարգին ծանոթանալու և օգտվելու որոշում կայացնելու
          համար
        </em>
        <em className="text-gray-100 font-semibold">
          4 Գրանցվելուց և մուտք գործելուց հետո կայքը ձեզ կառաջարկի կատարել
          վճարում որից հետո ցանկում ձեզ հասանելի կլինեն դասերը, այսինքն Images,
          A1 Level, A2 Level, B1 Level և B2 level մակարդակները
        </em>
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-xl text-purple-800 font-bold">
          Ինչպես կատարել վճարում
        </h1>
        <em className="text-gray-100 font-semibold">
          1 Վճարում բաճնում ֆիքսված է 2500 դրամ 30 օրվա համար
        </em>
        <em className="text-gray-100 font-semibold">
          2 Portfolio էջում դուք կարող եք մշտապես հետևել թէ քանի օր է դեռ
          հասանելի ձեր վճարումը
        </em>
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-xl text-purple-800 font-bold">Խորհուրդ է տրվում</h1>
        <em className="text-gray-100 font-semibold">
          1 Սովորել ամեն բաժնից հերթականությամբ օրինակ Images բաժնից մեկ
          կատեգորիա այնուհետև Words բաժնից հետո այդ նույն օրվա Lesson բաժնից և
          Theme բաժնի նույն օրվանը
        </em>
        <em className="text-gray-100 font-semibold">2 կրկնել անցած դասերը</em>
      </div>
    </div>
  );
};

export default Helppage;
