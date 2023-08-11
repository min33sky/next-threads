'use client';

import {
  CommentValidation,
  CommentValidationType,
} from '@/lib/validations/thread';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { addCommentToThread } from '@/lib/actions/thread.action';

interface CommentProps {
  threadId: string;
  currentUserId: string;
  currentUserImg: string;
}

export default function Comment({
  threadId,
  currentUserId,
  currentUserImg,
}: CommentProps) {
  const pathname = usePathname();

  const form = useForm<CommentValidationType>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (data: CommentValidationType) => {
    console.log('댓글 데이터 : ', data);
    try {
      await addCommentToThread({
        threadId,
        userId: currentUserId,
        commentText: data.thread,
        path: pathname,
      });

      console.log('댓글 작성 완료');
      form.reset();
    } catch (error) {
      console.log('댓글 작성 에러 : ', error);
    }
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}
