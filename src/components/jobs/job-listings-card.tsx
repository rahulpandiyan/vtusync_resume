'use client';

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building2, MapPin, Clock, DollarSign, Trash2} from "lucide-react";
import { getJobListings, deleteJob } from "@/utils/actions/jobs/actions";
import { createClient } from "@/utils/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";


type WorkLocationType = 'remote' | 'in_person' | 'hybrid';
type EmploymentType = 'full_time' | 'part_time' | 'co_op' | 'internship';

interface Job {
  id: string;
  company_name: string;
  position_title: string;
  location: string | null;
  work_location: WorkLocationType | null;
  employment_type: EmploymentType | null;
  salary_range: string | null;
  created_at: string;
  keywords: string[] | null;
}

export function JobListingsCard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [workLocation, setWorkLocation] = useState<WorkLocationType | undefined>();
  const [employmentType, setEmploymentType] = useState<EmploymentType | undefined>();

  // Fetch admin status
  useEffect(() => {
    async function checkAdminStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!profileError) {
          setIsAdmin(profile?.is_admin === true);
          return;
        }

        // Backward compatibility for deployments still using public.admins
        const { data: adminData } = await supabase
          .from('admins')
          .select('is_admin')
          .eq('user_id', user.id)
          .maybeSingle();

        setIsAdmin(adminData?.is_admin === true);
      }
    }
    
    checkAdminStatus();
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await getJobListings({
        page: currentPage,
        pageSize: 6,
        filters: {
          workLocation,
          employmentType
        }
      });
      setJobs(result.jobs);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, workLocation, employmentType]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  const formatWorkLocation = (workLocation: Job['work_location']) => {
    if (!workLocation) return 'Not specified';
    return workLocation.replace('_', ' ');
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deleteJob(jobId);
      // Refetch jobs after deletion
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="relative">
      <Card className="relative p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl overflow-hidden">

        
        <div className="relative flex flex-col space-y-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
            >
              Job Listings
            </motion.h2>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative group">
                <Select
                  value={workLocation}
                  onValueChange={(value: WorkLocationType) => setWorkLocation(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
                    <MapPin className="w-4 h-4 mr-2 text-zinc-500" />
                    <SelectValue placeholder="Work Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="remote">🌍 Remote</SelectItem>
                    <SelectItem value="in_person">🏢 In Person</SelectItem>
                    <SelectItem value="hybrid">🔄 Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="relative group">
                <Select
                  value={employmentType}
                  onValueChange={(value: EmploymentType) => setEmploymentType(value)}
                >
                  <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
                    <Briefcase className="w-4 h-4 mr-2 text-zinc-500" />
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                    <SelectItem value="full_time">⭐ Full Time</SelectItem>
                    <SelectItem value="part_time">⌛ Part Time</SelectItem>
                    <SelectItem value="co_op">🤝 Co-op</SelectItem>
                    <SelectItem value="internship">🎓 Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 space-y-4 animate-pulse bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-xl">
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded-full w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-1/2" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-full w-2/3" />
                  </Card>
                </motion.div>
              ))
            ) : jobs.map((job, idx) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="group relative p-6 space-y-5 hover:shadow-md transition-all duration-200 ease-out bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl overflow-hidden hover:-translate-y-1">

                  <div className="flex justify-between items-start">
                    <div className="space-y-2.5">
                      <h3 className="font-semibold text-lg line-clamp-1 text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-zinc-300 transition-colors duration-200">
                        {job.position_title}
                      </h3>
                      <div className="flex items-center text-zinc-500">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span className="line-clamp-1 group-hover:text-zinc-800 dark:group-hover:text-zinc-200 transition-colors duration-200">
                          {job.company_name}
                        </span>
                      </div>
                    </div>
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-red-500 hover:bg-red-50/50 transition-all duration-300"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location || 'Location not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span className="capitalize">{formatWorkLocation(job.work_location)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary_range}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(job.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {job.keywords?.slice(0, 3).map((keyword, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary" 
                        className="text-xs bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all duration-300"
                      >
                        {keyword}
                      </Badge>
                    ))}
                    {job.keywords && job.keywords.length > 3 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all duration-300"
                      >
                        +{job.keywords.length - 3} more
                      </Badge>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 mt-6"
          >
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 disabled:opacity-50 px-6 rounded-lg font-medium"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || isLoading}
              className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all duration-200 disabled:opacity-50 px-6 rounded-lg font-medium"
            >
              Next
            </Button>
          </motion.div>
        </div>
      </Card>
    </div>
  );
} 
