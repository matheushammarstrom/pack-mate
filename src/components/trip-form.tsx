'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CalendarIcon, Loader2, Check } from 'lucide-react';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { useDebounce } from '@/hooks/useDebounce';
import { GeocodingResponse } from '@/types/geocoding';

const tripFormSchema = z
  .object({
    title: z.string().min(1, 'Title is required'),
    destination: z.string().min(1, 'Destination is required'),
    startDate: z.date({
      error: 'Start date is required',
    }),
    endDate: z.date({
      error: 'End date is required',
    }),
    tripType: z.enum([
      'BUSINESS',
      'LEISURE',
      'ADVENTURE',
      'BEACH',
      'CITY_BREAK',
      'CAMPING',
      'CRUISE',
      'BACKPACKING',
      'FAMILY',
      'ROMANTIC',
      'OTHER',
    ]),
    description: z.string().optional(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type TripFormValues = z.infer<typeof tripFormSchema>;

interface TripFormProps {
  onSuccess?: () => void;
}

export function TripForm({ onSuccess }: TripFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destinationValidation, setDestinationValidation] = useState<{
    isValid: boolean | null;
    isLoading: boolean;
    coordinates?: { latitude: number; longitude: number };
  }>({ isValid: null, isLoading: false });

  const { data: tripTypes } = trpc.trip.getTripTypes.useQuery();
  const createTrip = trpc.trip.createTrip.useMutation();

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripFormSchema),
    defaultValues: {
      title: '',
      destination: '',
      tripType: 'BUSINESS',
      description: '',
    },
  });

  const destinationValue = form.watch('destination');
  const debouncedDestination = useDebounce(destinationValue, 1000);

  useEffect(() => {
    const validateDestination = async () => {
      if (!debouncedDestination || debouncedDestination.length < 2) {
        setDestinationValidation({ isValid: null, isLoading: false });
        form.clearErrors('destination');
        return;
      }

      setDestinationValidation({ isValid: null, isLoading: true });

      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            debouncedDestination
          )}&count=1`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch geocoding data');
        }

        const data: GeocodingResponse = await response.json();
        const isValid = data.results && data.results.length > 0;
        const coordinates =
          isValid && data.results[0]
            ? {
                latitude: data.results[0].latitude,
                longitude: data.results[0].longitude,
              }
            : undefined;

        setDestinationValidation({ isValid, isLoading: false, coordinates });

        if (!isValid) {
          form.setError('destination', {
            type: 'manual',
            message: 'Destination not found',
          });
        } else {
          form.clearErrors('destination');
        }
      } catch (error) {
        console.error('Geocoding validation error:', error);
        setDestinationValidation({ isValid: false, isLoading: false });
        form.setError('destination', {
          type: 'manual',
          message: 'Failed to validate destination',
        });
      }
    };

    validateDestination();
  }, [debouncedDestination, form]);

  const onSubmit = async (values: TripFormValues) => {
    setIsSubmitting(true);
    try {
      await createTrip.mutateAsync({
        ...values,
        latitude: destinationValidation.coordinates?.latitude,
        longitude: destinationValidation.coordinates?.longitude,
      });
      form.reset();
      setDestinationValidation({ isValid: null, isLoading: false });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create trip:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trip Title</FormLabel>
                <FormControl>
                  <Input placeholder="My Amazing Trip" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Paris, France" {...field} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {destinationValidation.isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : destinationValidation.isValid === true ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : null}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col ">
                <FormLabel>Start Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => {
                        const startDate = form.getValues('startDate');
                        return (
                          date < new Date() || (startDate && date <= startDate)
                        );
                      }}
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tripType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trip Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trip type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {tripTypes?.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type
                        .replace('_', ' ')
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your trip..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Trip
          </Button>
        </div>
      </form>
    </Form>
  );
}
