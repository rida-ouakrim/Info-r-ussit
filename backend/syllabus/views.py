from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Domain, Subdomain, Course, CourseProgress, UserCourseAnnotation
from .serializers import DomainSerializer, SubdomainSerializer, CourseSerializer, CourseDetailSerializer

class DomainListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = DomainSerializer
    queryset = Domain.objects.all().prefetch_related('subdomains')

class CourseListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseSerializer

    def get_queryset(self):
        queryset = Course.objects.all().select_related('subdomain', 'subdomain__domain')
        subdomain_code = self.request.query_params.get('subdomain')
        if subdomain_code:
            queryset = queryset.filter(subdomain__code=subdomain_code)
        return queryset

class CourseDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CourseDetailSerializer
    queryset = Course.objects.all().select_related('subdomain', 'subdomain__domain')

class ToggleCourseProgressView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Course not found"}, status=status.HTTP_404_NOT_FOUND)

        progress, created = CourseProgress.objects.get_or_create(user=request.user, course=course)
        # Toggle or set explicit value
        is_completed = request.data.get('is_completed', not progress.is_completed)
        progress.is_completed = bool(is_completed)
        progress.save()

        return Response({
            "course_id": course.id,
            "title": course.title,
            "is_completed": progress.is_completed
        })

class CourseStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        total = Course.objects.count()
        completed = CourseProgress.objects.filter(user=request.user, is_completed=True).count()
        percentage = round((completed / total * 100), 1) if total > 0 else 0.0
        return Response({
            "total": total,
            "completed": completed,
            "percentage": percentage
        })


class UserCourseAnnotationView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        annotation, _ = UserCourseAnnotation.objects.get_or_create(user=request.user)
        return Response({
            "highlights": annotation.highlights or {},
            "notes": annotation.notes or {},
            "updated_at": annotation.updated_at
        })

    def post(self, request):
        annotation, _ = UserCourseAnnotation.objects.get_or_create(user=request.user)
        new_highlights = request.data.get('highlights')
        new_notes = request.data.get('notes')
        replace_all = request.data.get('replace_all', False)

        if replace_all:
            if isinstance(new_highlights, dict):
                annotation.highlights = new_highlights
            if isinstance(new_notes, dict):
                annotation.notes = new_notes
        else:
            if isinstance(new_highlights, dict):
                hl = dict(annotation.highlights or {})
                hl.update(new_highlights)
                annotation.highlights = hl

            if isinstance(new_notes, dict):
                nt = dict(annotation.notes or {})
                nt.update(new_notes)
                annotation.notes = nt

        annotation.save()
        return Response({
            "status": "success",
            "highlights": annotation.highlights,
            "notes": annotation.notes,
            "updated_at": annotation.updated_at
        })
