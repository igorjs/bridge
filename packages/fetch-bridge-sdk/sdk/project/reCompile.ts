import Fetch from '../bridgeFetchMethod';

export default async (data: {
  query: { projectId: string };
  headers: { token: string };
}): Promise<
  | {
      data: {
        createdAt: Date;
        name: string;
        owner: string;
        serverUrl: string;
        provider: 'github' | 'gitlab' | 'cli';
        subscribedLanguages: Array<'python' | 'javascript' | 'typescript'>;
        lastCompilationSuccess: false | true;
        pendingCompilation: false | true;
        githubRepo?: {
          id: number;
          name: string;
          owner: string;
          full_name: string;
          visibility: 'private' | 'public';
          createdAt: Date;
        };
      } & { _id: string };
      error: null;
    }
  | {
      data: null;
      error:
        | { name: 'Wrong permission'; data?: any; status: 401 }
        | { name: 'Expired token'; data?: any; status: 401 }
        | { name: 'Invalid token'; data?: any; status: 401 }
        | { status: 404; name: 'Document not found' }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'User not connected with github'; data?: any; status: 401 }
        | {
            name: 'Undefined in result of github.getRepoZip';
            data?: any;
            status: 500;
          }
        | {
            name: 'Project not connected to github or gitlab';
            data?: any;
            status: 401;
          }
        | { name: 'Headers schema validation error'; status: 422; data: any }
        | { name: 'Query schema validation error'; status: 422; data: any }
        | { name: 'Axios Error'; status: 400; data: any }
        | { name: 'Internal Server Error'; status: 500 };
    }
> => {
  const res = await Fetch({
    ...data,
    method: 'POST',
    path: '/project/reCompile',
  });

  if (res.error && typeof res.error.status === 'number')
    return { data: null, error: res.error };
  else return { data: res, error: null };
};
