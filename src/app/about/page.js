"use client";

import React from "react";
import Image from "next/image";
import teachik from "./../images/Teachik.png";

const aboutpage = () => {
  return (
    <div>
      <Image src={teachik} alt="teacher" width={100} height={100} />

      <p className="text-white">we are legal education company</p>
    </div>
  );
};

export default aboutpage;
