'use client';
import React, {useEffect, useMemo, useState} from 'react';
import {supabase} from '@/lib/supabase';
import Image from 'next/image';

export type OnboardingStep =
  | 'welcome'
  | 'name'
  | 'request'
  | 'files'
  | 'thanks';
export type StepProps = {
  updateStep: (step: OnboardingStep) => void;
};

export function Welcome({updateStep}: StepProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-4xl font-bold'>
        Thanks for using our service! Let’s get things out of the way.
      </h1>
      <p className='text-white/50'>
        You’ll be prompted some questions about what you exactly want. From your
        thinking of the project, to the files you want to share with us.
      </p>

      <button
        className='btn btn-primary w-full mt-24'
        onClick={() => updateStep('name')}
      >
        Get Started
      </button>
    </div>
  );
}

export function ThankYou() {
  return (
    <div>
      <h1 className='text-4xl font-bold'>
        Thank you, we should have everything we need!
      </h1>
      <p className='text-white/50'>
        Catch you in a few days, we’ll be in touch with you soon. If you have
        any questions, feel free to reach out to us at!
      </p>

      <a href='https://dylanreed.dev' className='btn btn-primary w-full mt-24'>
        Go back home
      </a>
    </div>
  );
}

export type NameStepProps = {
  name: string;
  handleNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & StepProps;

export function Name({handleNameChange, name, updateStep}: NameStepProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    // Send the user's name to your database...
    const {data, error} = await supabase
      .from('projects')
      .insert([{name: name}]);

    if (error) {
      console.error('Error: ', error);
    } else {
      console.log('User data: ', data);
    }

    setLoading(false);
    updateStep('request');
  };

  return (
    <div>
      <h1 className='text-4xl font-bold'>Who are you?</h1>
      <p className='text-white/50'>
        We want to know who you are so we can get in touch with you. And will be
        stored in our database.
      </p>
      <div className='flex flex-col gap-4 mt-4'>
        <input
          type='text'
          placeholder='John Doe'
          value={name}
          onChange={handleNameChange}
          className='input input-bordered w-full border-[0.5px] border-white/25'
        />
        <button
          className='btn btn-primary w-full'
          onClick={() => handleSubmit()}
          disabled={loading}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export type RequestStepProps = {
  request: string;
  handleRequestChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & StepProps;

export function RequestStep({
  request,
  handleRequestChange,
  updateStep,
}: RequestStepProps) {
  const handleSubmit = async () => {
    updateStep('files');
  };
  return (
    <div>
      <h1 className='text-4xl font-bold'>What is your thinking?</h1>
      <p className='text-white/50'>
        We want to know what you want, what you’re thinking, and what you’re not
        thinking.
      </p>
      <div className='form-control mt-12'>
        <textarea
          value={request}
          onChange={handleRequestChange}
          className='textarea textarea-bordered h-52 border-[0.5px] border-white/25'
          placeholder='I want a website that does... The vibe I want... I want it to look like...'
        ></textarea>
      </div>

      {request.length > 0 && (
        <button
          className='btn btn-primary w-full mt-12'
          onClick={() => handleSubmit()}
        >
          Next
        </button>
      )}
    </div>
  );
}

export type FileStepProps = {
  files: string[];
  setFiles: any;
  finalSubmit: () => void;
} & StepProps;

export function FileStep({
  files,
  setFiles,
  updateStep,
  finalSubmit,
}: FileStepProps) {
  const uploadFile = async (file: File) => {
    try {
      const path = `public/${file.name}`;
      const {data, error} = await supabase.storage
        .from('project-files')
        .upload(path, file);

      const url = supabase.storage.from('project-files').getPublicUrl(path)
        .data.publicUrl;

      setFiles([...files, url]);
    } catch (error) {
      console.error('Error: ', error);
      return;
    }
  };

  const handleSubmit = async () => {
    updateStep('thanks');
  };
  return (
    <div>
      <h1 className='text-4xl font-bold'>Upload your files.</h1>
      <p className='text-white/50'>
        You can upload any files you want to share with us. From branding
        assets, to reference images. We’ll be able to see them and download
        them.
      </p>
      <div className='form-control w-full mt-12'>
        <input
          type='file'
          onChange={async (e) => {
            if (!e.target.files) return;
            await uploadFile(e.target.files[0]);
          }}
          className='file-input file-input-bordered w-full max-w-xs'
        />
      </div>

      <ul className='grid grid-cols-3 gap-4'>
        {files.map((file, idx) => (
          <li
            key={idx}
            className='flex items-center gap-2 overflow-hidden rounded-xl'
          >
            <div className='relative w-52 h-52 flex flex-col justify-end'>
              <button
                className='btn btn-ghost btn-xs relative z-20'
                onClick={() => setFiles(files.filter((f) => f !== file))}
              >
                Remove
              </button>
              <div className='absolute bg-gradient-to-t from-black to-transparent z-10 inset-0' />
              <Image
                src={file}
                alt='file'
                fill
                className='object-cover w-full h-full'
              />
            </div>
          </li>
        ))}
      </ul>

      <button
        className='btn btn-primary w-full mt-12'
        onClick={() => {
          handleSubmit();
          finalSubmit();
        }}
      >
        Next
      </button>
    </div>
  );
}

type OnboardingProps = {
  // children: React.ReactNode;
};

export default function Page({}: OnboardingProps) {
  const steps = useMemo(() => ['welcome', 'name', 'request', 'files'], []);
  const [step, setStep] = useState(steps[0]);
  const [request, setRequest] = useState('');
  const [files, setFiles] = useState<string[]>([]);
  const [name, setName] = useState('');
  const updateStep = (step: string) => {
    localStorage.setItem('step', step);
    setStep(step);
  };
  const [prompt, setPrompt] = useState<React.JSX.Element>(
    <Welcome updateStep={updateStep} />
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const finalSubmit = async () => {
    // Save the data to the database when transitioning to the 'thanks' step
    const data = {
      name,
      request,
      files,
    };

    if (!data.name || !data.request || !data.files) return;

    const res = await supabase.from('projects').insert(data);

    console.log(res);

    // Then, update the step
    updateStep('thanks');
  };

  useEffect(() => {
    if (localStorage.getItem('step')) {
      setStep(localStorage.getItem('step') as string);
    } else {
      localStorage.setItem('step', steps[0]);
      setStep(steps[0]);
    }
  }, [steps]);

  useEffect(() => {
    if (step === 'thanks') {
      localStorage.removeItem('step');
    }
    switch (step) {
      case 'welcome':
        setPrompt(<Welcome updateStep={updateStep} />);
        break;
      case 'name':
        setPrompt(
          <Name
            name={name}
            handleNameChange={(e) => setName(e.target.value)}
            updateStep={updateStep}
          />
        );
        break;
      case 'request':
        setPrompt(
          <RequestStep
            request={request}
            handleRequestChange={(e) => setRequest(e.target.value)}
            updateStep={updateStep}
          />
        );
        break;
      case 'files':
        setPrompt(
          <FileStep
            files={files}
            setFiles={setFiles}
            updateStep={updateStep}
            finalSubmit={finalSubmit}
          />
        );
        break;
      case 'thanks':
        setPrompt(<ThankYou />);
        break;
      default:
        setPrompt(<Welcome updateStep={updateStep} />);
        break;
    }
  }, [step, name, files, request]);

  console.log('data', {
    name,
    request,
    files,
  });

  return (
    <main className='min-h-screen flex justify-center items-center max-w-xl mx-auto'>
      {prompt}
    </main>
  );
}
